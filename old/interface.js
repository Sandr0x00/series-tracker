/* global showInfoDialog */
/* exported persistSerie, persistImage */

function persistSerie(title, state, oldStand) {
    if (oldStand !== state) {
        // send the data using post
        $.ajax({
            type: 'POST',
            url: 'server/post_series.php',
            data: {
                titel: title,
                stand: state
            },
            success: function(data) {
                if (data == null || data === '') {
                    return false;
                }
                showInfoDialog('dialog_error.html');
                $('#error-dialog').html('Fehler:<br>' + data);

                // this would return to the error handler, which does nothing
                return false;
            }
        });
    }
}

function persistImage(uploaded, title, image) {
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

/**
 * Delete a row in the file
 */
// function postDelete() {
//     // new state is entered
//     // update website
//     $('#' + title_ + '_div').remove();
//     hide();

//     // send the data using post
//     $.post('server/post_delete.php', {
//         titel: title
//     });
// }