// -----------------------------------------------------------------------------------------------------------------
// Info Dialog -----------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------

let $infoDialog = null;

function showInfoDialog() {
    $infoDialog = $('<div id="overlay2" class="container-fluid">'
        + '<div class="bg"></div>'
        + '<div class="d-flex align-items-end flex-column" style="height: 200px; position:fixed; top: 110px; right: 20px; z-index: 5;">'
        + '<div class="p-5 dialog" style="text-align: left">'
        + 'Stuff used:<br>'
        + 'Google Material Icons: <a href="https://material.io/icons/">https://material.io/icons/</a><br>'
        + 'Bootstrap: <a href="https://v4-alpha.getbootstrap.com/">https://v4-alpha.getbootstrap.com/</a><br>'
        + 'JQuery: <a href="https://jquery.com/">https://jquery.com/</a><br>'
        + 'JQuery Lazy: <a href="http://jquery.eisbehr.de/lazy/">http://jquery.eisbehr.de/lazy/</a>'
        + '</div>'
        + '</div>'
        + '</div>');
    $('body').append($infoDialog);
}

function hideInfoDialog() {
    $infoDialog.remove();
    $infoDialog = null;
}

$('#info').click(function () {
    if ($infoDialog) {
        hideInfoDialog();
    } else {
        showInfoDialog();
    }
});