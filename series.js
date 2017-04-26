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
    let marginLeft = '';
    let oldStand = '';

    function show(btn) {
        let titel_ = $(btn).attr('id');
        if (titel_ === 'plus') {
            $('#titel').val('');
            $('#titel').prop('readonly', false);
            $('#stand').val('');
            oldStand = '';
            showSmall();
            showButtons(oldStand);
            // $('#titel').focus();
        } else {
            // /g - search all
            let titel = titel_.replace(/_/g, ' ');
            let stand = $('#' + titel_ + '1').html();
            marginLeft = $('#' + titel_ + '_pic').css('margin-left');
            stand = stand.split('>')[1];
            oldStand = stand;
            $('#titel').val(titel);
            $('#titel').prop('readonly', true);
            $('#stand').val(stand);
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
        if (stand.match(REGEX_ALL)) {
            $('#EUP').css('display', 'inline-block');
            if (stand.match(REGEX_E)) {
                $('#SUP').css('display', 'none');
            } else {
                $('#SUP').css('display', 'inline-block');
            }
        } else {
            $('#EUP').css('display', 'none');
            $('#SUP').css('display', 'none');
        }
    }

    function showBoth(height) {
        $('#dialog').css('height', height + 'px');
        $('#dialog').css('margin-top', '-' + height / 2 + 'px');
        $('#bg').css('display', 'block');
        $('#dialog').css('display', 'block');
    }

    function showSmall() {
        $('#pic').css('display', 'none');
        $('#titel').css('display', 'block');
        showBoth(162);
    }

    function showBig(pic) {
        $('#pic').attr('src', pic);
        $('#pic').css('display', 'inline-block');
        $('#titel').css('display', 'none');
        showBoth(432);
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
            if ($('#form')[0].checkValidity()) {
                $('#form').submit();
            }
        }
    });

    $('#submit').click(() => {
        if ($('#form')[0].checkValidity()) {
            $('#form').submit();
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
                $('body').prepend(
                    $('<a class="n" id="' + titel_ + '"><img src="img/200/unknown.jpg" height="200px" width="130px" alt="' + titel + '"/><span class="n" id="' + titel_ + '1"><br>' + stand + '</span></a>'));
                $('body').delegate(
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
            if (marginLeft !== '') {
                $.post('seriesPost.php', {
                    titel: titel,
                    stand: stand,
                    margin: marginLeft
                });
            } else {
                $.post('seriesPost.php', {
                    titel: titel,
                    stand: stand
                });

            }
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
        let stand = $('#stand').val();
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
            $('#stand').val(stand);
            $('#stand').focus();
        }
    });

    $('#EUP').click(() => {
        let stand = $('#stand').val();
        if (stand.match(REGEX_ALL)) {
            let episode = stand.split('E')[1];
            let epSize = episode.length;
            episode = parseInt(episode);
            episode++;
            episode = episode.pad(epSize);
            stand = stand.split('E')[0];
            stand = stand + 'E' + episode;
            $('#stand').val(stand);
            $('#stand').focus();
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