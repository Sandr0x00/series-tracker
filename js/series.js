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
    const REGEX_ALL = '^((S|B)[0-9]{2}E[0-9]{2}|E[0-9]{5})$';
    const REGEX_B = '^B[0-9]{2}E[0-9]{2}$';
    const REGEX_S = '^S[0-9]{2}E[0-9]{2}$';
    const REGEX_E = '^E[0-9]{5}$';
    let oldStand = '';

    function show(btn) {
        let titel_ = $(btn).attr('id');
        let titleElement = $('#titel');
        let standElement = $('#stand');
        if (titel_ === 'plus') {
            titleElement.val('');
            titleElement.prop('readonly', false);
            standElement.val('');
            oldStand = '';
            showSmall();
            showButtons(oldStand);
            // $('#titel').focus();
        } else {
            // /g - search all
            let titel = titel_.replace(/_/g, ' ');
            let stand = $('#' + titel_ + '1').html();
            stand = stand.split('>')[1];
            oldStand = stand;
            titleElement.val(titel);
            titleElement.prop('readonly', true);
            standElement.val(stand);
            let found = false;
            for (let i = 300; i <= 500 && !found; i += 100) {
                let picUrl = 'img/' + i + '/' + titel + '.jpg';
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
                showSmall();
            }
            showButtons(stand);
            // $('#stand').focus();
            // $('#stand').setSelectionRange(stand[1].length,
            // stand[1].length);
        }
    }

    function showButtons(stand) {
        let sup = $('#SUP');
        let eup = $('#EUP');
        if (stand.match(REGEX_ALL)) {
            // enable EUP
            eup.attr('disabled', false);
            eup.removeClass('disabled');

            if (stand.match(REGEX_E)) {
                // disable SUP
                sup.attr('disabled', true);
                sup.addClass('disabled');
            } else {
                // enable SUP
                sup.removeClass('disabled');
                sup.attr('disabled', false);
            }
        } else {
            // disable SUP and EUP
            sup.attr('disabled', true);
            eup.attr('disabled', true);
            sup.addClass('disabled');
            eup.addClass('disabled');
        }
    }

    function showBoth(height) {
        let dialog = $('#dialog');
        dialog.css('height', height + 'px');
        dialog.css('margin-top', '-' + height / 2 + 'px');
        $('#bg').css('display', 'block');
        dialog.css('display', 'block');
    }

    function showSmall() {
        $('#pic').css('display', 'none');
        $('#titleDiv').css('display', 'inline-flex');
        showBoth(182);
    }

    function showBig(pic) {
        let picElem = $('#pic');
        picElem.attr('src', pic);
        picElem.css('display', 'inline-block');
        $('#titleDiv').css('display', 'none');
        showBoth(492);
    }

    function hide() {
        $('#bg').css('display', 'none');
        $('#dialog').css('display', 'none');
    }

    $('a').click(function() {
        show(this);
    });

    $('#titel').keyup((e) => {
        if (e.keyCode === KEY.ENTER) {
            $('#stand').focus();
        }
    });

    $('#stand').keyup((e) => {
        showButtons($('#stand').val());
        if (e.keyCode === KEY.ENTER) {
            // check form validity
            let form = $('#form');
            if (form[0].checkValidity()) {
                form.submit();
            }
        }
    });

    $('#submit').click(() => {
        let form = $('#form');
        if (form[0].checkValidity()) {
            form.submit();
        }
    });

    $('#form').submit(function() {
        let titel = $('#titel').val();
        let stand = $('#stand').val();
        if (oldStand !== stand) {
            // new state is entered
            let titel_ = titel.replace(/ /g, '_');
            // TODO: wenn schon vorhanden, dann
            // in else rein
            if (!oldStand || 0 === oldStand.length) {
                // same logic in series.php
                // insert new serie
                let body = $('#seriesContent');
                body.prepend(
                    $('<a class="n" id="' + titel_ + '"><img src="../img/200/unknown.jpg" height="200px" width="130px" alt="' + titel + '"/><span class="n" id="' + titel_ + '1"><br>' + stand + '</span></a>'));
                body.delegate(
                    '#' + titel_,
                    'click',
                    function() {
                        show(this);
                    });
            } else {
                // update old serie
                $('#' + titel_ + '1').html('<br>' + stand);
            }
            // send the data using post
            $.post('seriesPost.php', {
                titel: titel,
                stand: stand
            });
        }
        hide();
    });

    $(window).keypress((e) => {
        if (e.keyCode === KEY.ESCAPE) {
            hide();
        }
    });

    $('#bg').click(() => {
        hide();
    });

    $('#SUP').click(() => {
        let standElem = $('#stand');
        let stand = standElem.val();
        if (stand.match(REGEX_ALL)) {
            let season = stand.split('E')[0];
            if (stand.match(REGEX_B)) {
                season = season.split('B')[1];
                stand = 'B';
            } else if (stand.match(REGEX_S)) {
                season = season.split('S')[1];
                stand = 'S';
            }
            season = parseInt(season);
            season++;
            season = season.pad(2);
            stand = stand + season + 'E01';
            standElem.val(stand);
            standElem.focus();
        }
    });

    $('#EUP').click(() => {
        let standElem = $('#stand');
        let stand = standElem.val();
        if (stand.match(REGEX_ALL)) {
            let episode = stand.split('E')[1];
            let epSize = episode.length;
            episode = parseInt(episode);
            episode++;
            episode = episode.pad(epSize);
            stand = stand.split('E')[0];
            stand = stand + 'E' + episode;
            standElem.val(stand);
            standElem.focus();
        }
    });
});

function refresh() {
    $.ajax({
        type: 'GET',
        url: 'recalculate.php',
        success: function () {
            location.reload();
        }
    });
}