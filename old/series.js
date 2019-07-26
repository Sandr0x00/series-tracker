/* global registerTooltip, showEditDialog, showHideInfoDialog */
/* exported changeStyle, setListeners */

/**
 * {
 * '"Jessica Jones":{status: "S01E01", image: "file location"},
 * ...
 * }
 */
let series = null;

let seriesMd5 = null;


let reverse = false;

$(document).ready(function () {
    // $('#info').click(document.getElementById());

    // ---------------------------------------------------------------------
    // Auto Update ---------------------------------------------------------
    // ---------------------------------------------------------------------

    let refreshCircle = $('#refresh-clock');

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

});

function refresh() {
    let req = new XMLHttpRequest();
    //console.log("Grabbing Value");
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let newMd5 = $.md5(req.responseText);
            series = JSON.parse(req.responseText);
            if (newMd5 !== seriesMd5) {
                Object.keys(series).forEach(serie => addSerie(serie, true));
                $('.lazy').Lazy({
                    delay: 0
                });
                seriesMd5 = newMd5;
            }
        }
    };
    req.open('GET', 'server/get.php?md5=' + seriesMd5, true); // Grabs whatever you've written in this file
    req.send(null);
    reverse = !reverse;
}

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
            showEditDialog(this);
        }
    );
    registerTooltip();
}
