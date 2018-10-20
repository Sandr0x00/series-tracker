// -----------------------------------------------------------------------------------------------------------------
// Info Dialog -----------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------

let infoDialog = null;

function showInfoDialog(infoPanel) {
    infoDialog = $('<div id="overlay2" class="container-fluid">'
        + '<div id="bg2" class="bg" onClick="hideInfoDialog()"></div>'
        + infoPanel
        + '</div>');
    $('body').append(infoDialog);
    $('#changestyle').click(changeStyle);
}

function hideInfoDialog() {
    infoDialog.remove();
    infoDialog = null;
}

$('#info').click(function () {
    if (infoDialog) {
        hideInfoDialog();
    } else {
        let infoPanel = '<div class="d-flex align-items-end flex-column" style="height: 200px; position:fixed; top: 110px; right: 20px; z-index: 5;">'
        + '<div class="p-5 dialog" style="text-align: left">'
        + 'Style:<br>'
        + '<a href="#" id="changestyle">Switch Style</a><br><br>'
        + 'Stuff used:<br>'
        + 'Google Material Icons: <a href="https://material.io/icons/">https://material.io/icons/</a><br>'
        + 'Bootstrap: <a href="https://v4-alpha.getbootstrap.com/">https://v4-alpha.getbootstrap.com/</a><br>'
        + 'JQuery: <a href="https://jquery.com/">https://jquery.com/</a><br>'
        + 'JQuery Lazy: <a href="http://jquery.eisbehr.de/lazy/">http://jquery.eisbehr.de/lazy/</a><br>'
        + '<br>'
        + 'Download status: <a href="server/get_status.php">status.txt</a><br/>'
        + 'Upload status: <form action="server/post_status_file.php" method="post" enctype="multipart/form-data"><input type="file" name="file" id="file"><input type="submit" value="Upload" name="submit"></form>'
        + '<br>'
        + 'Made by <a href="https://github.com/Sandr00">Sandr0</a>'
        + '</div>'
        + '</div>';
        showInfoDialog(infoPanel);
    }
});