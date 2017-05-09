Number.prototype.pad = function (size) {
    let s = String(this);
    while (s.length < size) {
        s = '0' + s;
    }
    return s;
};

$(document).ready(function () {
    const KEY = {
        ESCAPE: 27,
        ENTER: 13
    };
    const REGEX_S = '^S[0-9]{2}E[0-9]{2}$';
    const REGEX_E = '^E[0-9]{5}$';

    const TITLE_ID = '#titel';
    const STATUS_ID = '#stand';

    const SUBMIT_ID = '#submit';
    const EUP_ID = '#EUP';
    const SUP_ID = '#SUP';

    const BG_ID = '#bg';

    let dialog = $('#dialog');

    let titleElement = document.getElementById('titel');
    let statusElement = document.getElementById('stand');
    let titleJQuery = $(TITLE_ID);
    let statusJQuery = $(STATUS_ID);
    let picJQuery = $('#pic');

    let oldStand = '';
    let title = null;
    let status = null;

    function show(btn) {
        let titel_ = $(btn).attr('id');
        if (titel_ === 'plus') {
            titleJQuery.val('');
            titleJQuery.prop('readonly', false);
            statusJQuery.val('');
            oldStand = '';
            showBig(null);
            updateButtons();
            titleJQuery.focus();
        } else {
            // /g - search all
            let title = titel_.replace(/_/g, ' ');
            status = $('#' + titel_ + '1').html();
            status = status.split('>')[1];
            oldStand = status;
            titleJQuery.val(title);
            titleJQuery.prop('readonly', true);
            statusJQuery.val(status);
            let found = false;
            for (let i = 300; i <= 500 && !found; i += 100) {
                let picUrl = 'img/' + i + '/' + title + '.jpg';
                $.ajax({
                    url: picUrl,
                    type: 'HEAD',
                    async: false,
                    success: () => {
                        showBig(picUrl);
                        found = true;
                    }
                });
            }
            if (!found) {
                showBig(null);
            }
            updateButtons();
            statusJQuery.focus();
            // $(STATUS_ID).setSelectionRange(stand[1].length,
            // stand[1].length);
        }
    }

    /**
     * Enables and disables the buttons
     */
    function updateButtons() {
        updateTitle();
        let sup = $(SUP_ID);
        let eup = $(EUP_ID);
        let submit = $(SUBMIT_ID);

        if (status && statusElement.checkValidity()) {
            enable(eup);
            enable(submit);

            if (status.match(REGEX_E)) {
                disable(sup);
            } else {
                enable(sup);
            }
        } else {
            disable(eup);
            disable(sup);
            disable(submit);
        }

        if (titleElement && !titleElement.checkValidity()) {
            disable(submit);
        }
    }

    /**
     * Disables a button
     * @param button button to disable
     */
    function disable(button) {
        button.attr('disabled', true);
        button.addClass('disabled');
    }

    /**
     * Enables a button.
     * @param button button to enable
     */
    function enable(button) {
        button.attr('disabled', false);
        button.removeClass('disabled');
    }

    function showBoth(height) {
        dialog.css('height', height + 'px');
        dialog.css('margin-top', '-' + height / 2 + 'px');
        $(BG_ID).css('display', 'block');
        dialog.css('display', 'block');
    }

    function showBig(pic) {
        if (pic) {
            picJQuery.attr('src', pic);
            picJQuery.css('display', 'inline-block');
            dropZoneJQuery.css('display', 'none');
        } else {
            picJQuery.css('display', 'none');
            dropZoneJQuery.css('display', 'inline-block');
        }
        $('#titleDiv').css('display', 'none');
        showBoth(492);
    }

    function hide() {
        $(BG_ID).css('display', 'none');
        dialog.css('display', 'none');
    }

    /**
     * Updates Picture
     * @param title
     */
    function getData(title) {
        if (!titleElement.checkValidity()) {
            // title string is invalid
            showBig(null);
            return;
        }

        let serie = series[title];
        if (serie) {
            // serie is already known
            statusJQuery.val(serie.status);
            showBig(serie.image);

            // TODO: load picture
            //picJQuery.attr('src', pic);
        } else {
            // serie is not known
            showBig(null);
        }
        // TODO: get data from db, lazyload
    }

    function updateStatus() {
        status = $(STATUS_ID).val();
        status = status.trim();
    }

    function updateTitle() {
        title = titleJQuery.val();
        title = title.trim();
    }

    $('a').click(function() {
        show(this);
    });

    function titleChanged() {
        updateTitle();
        getData(title);
        updateButtons();
    }

    titleJQuery.change(titleChanged);

    titleJQuery.keyup(function(e) {
        titleChanged();
        if (e.keyCode === KEY.ENTER) {
            $(STATUS_ID).focus();
        }
    });

    function statusChanged() {
        updateStatus();
        updateButtons();
    }

    statusJQuery.change(statusChanged);

    statusJQuery.keyup(function(e) {
        statusChanged();
        if (e.keyCode === KEY.ENTER) {
            // check form validity
            let form = $('#form');
            if (form[0].checkValidity()) {
                form.submit();
            }
        }
    });

    $(SUBMIT_ID).click(() => {
        let form = $('#form');
        if (form[0].checkValidity()) {
            form.submit();
        }
    });

    $('#form').submit(function() {
        updateTitle();
        updateStatus();
        if (oldStand !== status) {
            // new state is entered
            let titel_ = title.replace(/ /g, '_');
            // TODO: wenn schon vorhanden, dann
            // in else rein
            if (!oldStand || 0 === oldStand.length) {
                // same logic in series.php
                // insert new serie
                let body = $('#seriesContent');
                body.prepend(
                    $('<a class="n" id="' + titel_ + '"><img src="../img/200/unknown.jpg" height="200px" width="130px" alt="' + title + '"/><span class="n" id="' + titel_ + '1"><br>' + status + '</span></a>'));
                body.delegate(
                    '#' + titel_,
                    'click',
                    function() {
                        show(this);
                    });
            } else {
                // update old serie
                $('#' + titel_ + '1').html('<br>' + status);
            }
            // send the data using post
            $.post('server/seriesPost.php', {
                titel: title,
                stand: status
            });
        }
        hide();
    });

    $(window).keypress((e) => {
        if (e.keyCode === KEY.ESCAPE) {
            hide();
        }
    });

    $(BG_ID).click(() => {
        hide();
    });

    $(SUP_ID).click(() => {
        updateStatus();
        if (statusElement.checkValidity()) {
            // increment season
            let season = status.split('E')[0];
            if (status.match(REGEX_S)) {
                season = season.split('S')[1];
                status = 'S';
            }
            season = parseInt(season);
            season++;
            season = season.pad(2);
            status = status + season + 'E01';
            statusJQuery.val(status);
            statusJQuery.focus();
        }
    });

    $(EUP_ID).click(() => {
        updateStatus();
        if (statusElement.checkValidity()) {
            // increment episode
            let episode = status.split('E')[1];
            let epSize = episode.length;
            episode = parseInt(episode);
            episode++;
            episode = episode.pad(epSize);
            status = status.split('E')[0];
            status = status + 'E' + episode;
            statusJQuery.val(status);
            statusJQuery.focus();
        }
    });

    // -----------------------------------------------------------------------------------------------------------------
    // File Drop -------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    // Setup the dnd listeners.
    let dropZone = document.getElementById('drop_zone');
    let dropZoneJQuery = $('#drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

    function handleFileSelect(evt) {
        // TODO: upload to server
        evt.stopPropagation();
        evt.preventDefault();

        let files = evt.dataTransfer.files; // FileList object

        for (let i = 0, f; f = files[i]; i++) {
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            let reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    // Render thumbnail
                    showBig(e.target.result);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Lazy Load -------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------
    $('.lazy').Lazy();
});
