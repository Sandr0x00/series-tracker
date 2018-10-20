Number.prototype.pad = function (size) {
    let s = String(this);
    while (s.length < size) {
        s = '0' + s;
    }
    return s;
};

const dark = 'dark';
const light = 'light';

$(document).ready(function () {
    // handle cookie
    handleCookie();

    // ---------------------------------------------------------------------
    // Vars & Constants ----------------------------------------------------
    // ---------------------------------------------------------------------

    /**
     * {
     * '"Jessica Jones":{status: "S01E01", image: "file location"},
     * ...
     * }
     */
    let series = null;

    let seriesMd5 = null;

    const KEY = {
        ESCAPE: 27,
        ENTER: 13
    };
    const REGEX_S = '^S[0-9]{2}E[0-9]{2}$';
    const REGEX_E = '^E[0-9]{5}$';
    const REGEX_X = '^(SxxE|Exxx)xx$';

    const TITLE_ID = '#titel';
    const STATUS_ID = '#stand';

    const SUBMIT_ID = '#submit';
    const EUP_ID = '#EUP';
    const SUP_ID = '#SUP';

    let bg = $('#bg');
    let overlay = $('#overlay');

    let titleElement = document.getElementById('titel');
    let statusElement = document.getElementById('stand');
    let titleJQuery = $(TITLE_ID);
    let statusJQuery = $(STATUS_ID);

    let uploaded = false;

    // Cache variables
    let image = null;
    let title = null;
    let title_ = null;
    let status = null;

    let oldStand = '';

    // Setup the dnd listeners.
    let picElement = document.getElementById('pic');
    let picJQuery = $('#pic');
    let dropZone = document.getElementById('drop_zone');
    let dropZoneJQuery = $('#drop_zone');

    // ---------------------------------------------------------------------
    // Functions -----------------------------------------------------------
    // ---------------------------------------------------------------------

    function show(btn) {
        let titel_ = $(btn).attr('id');
        uploaded = false;
        if (titel_ === 'plus') {
            setVariables(null, null, null);
            titleJQuery.prop('readonly', false);
            oldStand = '';
            showDialog();
            titleJQuery.focus();
        } else {
            // /g - search all
            let title = titel_.replace(/_/g, ' ');
            setVariables(title, series[title].status, series[title].image);
            oldStand = status;
            titleJQuery.prop('readonly', true);
            showDialog();
            statusJQuery.focus();
        }
    }

    /**
     * Updates the cache variables
     * @param t
     * @param s
     * @param i
     */
    function setVariables(t, s, i) {
        title = t;
        status = s;
        image = i;
        statusJQuery.val(status ? status : '');
        titleJQuery.val(title ? title : '');
    }

    function setStatus(s) {
        status = s;
        if (status) {
            status = status.trim();
        }
    }

    function setTitle() {
        title = titleJQuery.val();
        if (title) {
            title = title.trim();
            title_ = title.replace(/ /g, '_');
        }
    }

    function setImage(i) {
        image = i;
    }

    /**
     * Enables and disables the buttons
     */
    function updateButtons() {
        setTitle();
        setStatus(statusJQuery.val());
        let sup = $(SUP_ID);
        let eup = $(EUP_ID);
        let submit = $(SUBMIT_ID);

        if (status && statusElement.checkValidity()) {
            enable(sup);
            enable(eup);
            enable(submit);

            if (status.match(REGEX_E)) {
                disable(sup);
            }
            if (status.match(REGEX_X)) {
                disable(sup);
                disable(eup);
            }
        } else {
            disable(sup);
            disable(eup);
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

    function showDialog() {
        if (image && image !== '') {
            picJQuery.attr('src', image);
            picJQuery.css('display', 'inline-block');
            dropZoneJQuery.css('display', 'none');
        } else {
            picJQuery.css('display', 'none');
            dropZoneJQuery.css('display', 'inline-block');
        }
        overlay.css('display', 'block');
        disableScroll();
        updateButtons();
    }

    function hide() {
        overlay.css('display', 'none');
        enableScroll();
    }

    function titleChanged() {
        setTitle();
        let serie = null;
        if (titleElement.checkValidity()) {
            serie = series[title];
        }
        if (serie) {
            // serie is already known
            setImage(serie.image);
            setStatus(serie.status);
            statusJQuery.val(serie.status);
            uploaded = false;
        } else {
            if (!uploaded) {
                setImage(null);
            }
            setStatus(null);
            statusJQuery.val('');
        }
        showDialog();
    }

    function statusChanged() {
        setStatus(statusJQuery.val());
        updateButtons();
    }

    function clickEvent(builder) {
        setStatus(statusJQuery.val());
        if (statusElement.checkValidity()) {
            // increment episode
            setStatus(builder());
            statusJQuery.val(status);
            statusJQuery.focus();
        }
        updateButtons();
    }

    function buildE() {
        let episode = status.split('E')[1];
        let epSize = episode.length;
        episode = parseInt(episode);
        episode++;
        episode = episode.pad(epSize);
        let s = status.split('E')[0];
        s = s + 'E' + episode;
        return s;
    }

    function buildSE() {
        let s;
        let season = status.split('E')[0];
        if (status.match(REGEX_S)) {
            season = season.split('S')[1];
            s = 'S';
        }
        season = parseInt(season);
        season++;
        season = season.pad(2);
        s = s + season + 'E01';
        return s;
    }

    function archive() {
        let s = 'Exxxxx';
        if (status.match(REGEX_S)) {
            s = 'SxxExx';
        }
        return s;
    }

    // disable scroll

    let keys = {37: 1, 38: 1, 39: 1, 40: 1};

    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    function disableScroll() {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', preventDefault, false);
        window.onwheel = preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
        window.ontouchmove  = preventDefault; // mobile
        document.onkeydown  = preventDefaultForScrollKeys;
    }

    function enableScroll() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    }

    // ---------------------------------------------------------------------
    // Send Data to Server -------------------------------------------------
    // ---------------------------------------------------------------------

    /**
     * Delete a row in the file
     */
    function postDelete() {
        // new state is entered
        // update website
        $('#' + title_ + '_div').remove();
        hide();

        // send the data using post
        $.post('server/post_delete.php', {
            titel: title
        });
    }

    function persistSerie() {
        if (oldStand !== status) {
            // send the data using post
            $.ajax({
                type: 'POST',
                url: 'server/post_series.php',
                data: {
                    titel: title,
                    stand: status
                },
                success: function(data) {
                    if (data == null || data === '') {
                        return false;
                    }
                    let infoPanel = '<div class="d-flex align-items-end flex-column" style="height: 200px; position:fixed; top: 110px; right: 20px; z-index: 5;">'
                    + '<div class="p-5 dialog" style="text-align: left">'
                    + 'Fehler:<br>'
                    + data
                    + '</div>'
                    + '</div>';
                    showInfoDialog(infoPanel);

                    // this would return to the error handler, which does nothing
                    return false;
                }
            });
        }
    }

    function persistImage() {
        if (uploaded && image) {
            let formData = new FormData();
            formData.append('titel', title);
            formData.append('image', image);

            $.ajax({
                url: 'server/post_series.php',
                type: 'POST',
                data: formData,
                async: true,
                cache: false,
                contentType: false,
                processData: false
            });
        }
    }

    // ---------------------------------------------------------------------
    // HTML Updates --------------------------------------------------------
    // ---------------------------------------------------------------------

    /**
     * Adds a serie and deletes the old one if there is one.
     * @param title Use specific title here, not the globally available one.
     * @param append
     */
    function addSerie(title, append) {
        let serie = series[title];
        let title_ = title.replace(/ /g, '_');

        let body = $('#seriesContent');

        let div = '<div id="' + title_ + '_div" class="seriesDiv col-xs-6 col-sm-3 col-md-2 col-lg-2 col-xl-1">';
        div += '<a class="series lazy display" id="' + title_ + '"';
        if (serie.image) {
            div += ' data-src="' + serie.image + '"';
        }
        div += ' data-toggle="tooltip" data-original-title="' + title + '">';
        div += '<span class="shadow" id="' + title_ + '_status">' + serie.status + '</span>';
        div += '</a>';
        div += '</div>';

        let old = $('#' + title_ + '_div');
        if (old.length > 0) {
            old.remove();
        }

        if (append) {
            body.append($(div));
        } else {
            body.prepend($(div));
        }
        body.delegate(
            '#' + title_,
            'click',
            function () {
                show(this);
            }
        );
        registerTooltip();
    }

    function updateHTML() {
        refresh();
        /*let update = false;
        if (oldStand !== status) {
            // new state is entered
            if (!oldStand || 0 === oldStand.length) {
                // insert new serie
                series[title] = {status: status, image: image};
                // update website
                update = true;
            } else {
                // update old serie
                series[title].status = status;
                series[title].image = image;
                // update website
                update = true;
            }
        }
        if (uploaded && image) {
            update = true;

            series[title].image = image;
        }
        if (update) {
            if (status.match(REGEX_X)) {
                addSerie(title, true);
            } else {
                addSerie(title, false);
            }
            initLazyLoading();
        }*/
    }

    // ---------------------------------------------------------------------
    // File Drop -----------------------------------------------------------
    // ---------------------------------------------------------------------

    function handleFileSelect(evt) {
        // TODO: upload to server
        evt.stopPropagation();
        evt.preventDefault();

        let files = evt.dataTransfer.files; // FileList object

        for (let i = 0, f; i < files.length; i++) {
            f = files[i];
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            let reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail
                    setImage(e.target.result);
                    showDialog();
                    uploaded = true;
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

    // ---------------------------------------------------------------------
    // Lazy Load -----------------------------------------------------------
    // ---------------------------------------------------------------------

    function initLazyLoading() {
        $('.lazy').Lazy({
            delay: 0
        });
    }

    // ---------------------------------------------------------------------
    // Auto Update ---------------------------------------------------------
    // ---------------------------------------------------------------------

    let reverse = false;
    let refreshCircle = $('#refresh-clock');

    function refresh() {
        let req = new XMLHttpRequest();
        //console.log("Grabbing Value");
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                let newMd5 = $.md5(req.responseText);
                series = JSON.parse(req.responseText);
                if (newMd5 !== seriesMd5) {
                    Object.keys(series).forEach(serie => addSerie(serie, true));
                    initLazyLoading();
                    seriesMd5 = newMd5;
                }
            }
        };
        req.open('GET', 'server/get.php?md5=' + seriesMd5, true); // Grabs whatever you've written in this file
        req.send(null);
        reverse = !reverse;
    }

    refresh(); // Then runs the refresh function for the first time.
    self.setInterval(function () {
        refresh();
        refreshCircle.css('transition', 'stroke-dashoffset 10000ms ease-in-out');
        refreshCircle.css('stroke-dashoffset', reverse ? 100 : 0);
    }, 10000); // Set the refresh() function to run every 10 seconds. [1 second would be 1000, and 1/10th of a second would be 100 etc.

    $('#refresh').on('click', () => {
        refresh();
        refreshCircle.css('transition', 'none');
        refreshCircle.css('stroke-dashoffset', reverse ? 100 : 0);
    });

    // ---------------------------------------------------------------------
    // Run -----------------------------------------------------------------
    // ---------------------------------------------------------------------

    picElement.addEventListener('dragover', handleDragOver, false);
    picElement.addEventListener('drop', handleFileSelect, false);
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

    $('.display').click(function () {
        show(this);
    });

    $('#plus').click(function () {
        show(this);
    });

    titleJQuery.change(titleChanged);

    titleJQuery.keyup(function (e) {
        titleChanged();
        if (e.keyCode === KEY.ENTER) {
            $(STATUS_ID).focus();
        }
    });

    statusJQuery.change(statusChanged);

    statusJQuery.keyup(function (e) {
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

    $('#form').submit(function () {
        // update everything
        setTitle();
        setStatus(statusJQuery.val());

        // send stuff
        persistSerie();
        persistImage();
        updateHTML();
        hide();
    });

    $(window).on('keypress', e => {
        if (e.keyCode === KEY.ESCAPE) {
            hide();
        }
    });

    bg.on('click', hide);

    $('#delete').click(() =>
        clickEvent(archive)
    );

    $('#close').click(hide);

    $(SUP_ID).click(() =>
        clickEvent(buildSE)
    );

    $(EUP_ID).click(() =>
        clickEvent(buildE)
    );

    // Tooltip

    function registerTooltip () {
        $('[data-toggle="tooltip"]').tooltip({
            placement: 'top',
            container: 'body',
            offset: '0, -100%',
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
            // boundary: 'window'
        });
    }

    // -------------------------------------------------
    // Basic Fuzzy search (use all letters for searching)
    // -------------------------------------------------

    $('#search').on('keyup', function() {
        let value = this.value;

        let content = $('#seriesContent');
        content.children().each(function () {
            $(this).toggle(fuzzySearch($(this).find('a').data('originalTitle'), value));
        });
    });

    let grep = function (array, callback, invert) {
        let returnArray = [], callbackValue;

        // we negate the invert
        invert = !!invert;

        // Go through the array, only saving the items that pass the validator function
        for (let i = array.length; i--;) {
            callbackValue = !!callback(array[i], i);
            if (invert !== callbackValue) {
                returnArray.push(array[i]);
            }
        }
        return returnArray;
    };

    let fuzzySearch = (text, query) => {
        text = text.toLowerCase();
        query = query.toLowerCase().split('');

        return !grep(query, value => {
            return text.indexOf(value) === -1;
        }).length;
    };
});

function changeStyle() {
    $('body').toggleClass(dark);
    $('body').toggleClass(light);

    if ($('body').hasClass(light)) {
        setCookie('theme', light);
    } else {
        setCookie('theme', dark);
    }
}

/*
let $list = $('#list');

$('#search').on('keyup', function () {
    let value = this.value;
    $list.find('li').each(function () {
        $(this).toggle(fuzzySearch(this.innerText, value));
    });
});*/

function handleCookie() {
    let cName = 'theme';
    let theme = getCookie(cName);
    if (theme !== '') {
        if ((theme === dark && $('body').hasClass(light))
        || (theme === light && $('body').hasClass(dark))) {
            $('body').toggleClass(light);
            $('body').toggleClass(dark);
        }
    } else {
        if ($('body').hasClass(light)) {
            setCookie(cName, light);
        } else {
            setCookie(cName, dark);
        }
    }
}

function setCookie(cname, cvalue) {
    let d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires;
}

function getCookie(cname) {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}
