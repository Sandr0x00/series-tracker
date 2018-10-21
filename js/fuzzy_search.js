$(document).ready(function () {
    $('#search').on('keyup', function() {
        let value = this.value;
        let content = $('#seriesContent');
        content.children().each(function () {
            $(this).toggle(fuzzySearch($(this).find('a').data('originalTitle'), value));
        });
    });
});

// -------------------------------------------------
// Basic Fuzzy search (use all letters for searching)
// -------------------------------------------------

function grep(array, callback, invert) {
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
}

function fuzzySearch(text, query) {
    text = text.toLowerCase();
    query = query.toLowerCase().split('');

    return !grep(query, value => {
        return text.indexOf(value) === -1;
    }).length;
}