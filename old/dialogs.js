/* global persistSerie, persistImage, refresh, series, setCookie */
/* exported showEditDialog, showHideInfoDialog */

Number.prototype.pad = function (size) {
    let s = String(this);
    while (s.length < size) {
        s = '0' + s;
    }
    return s;
};

$(document).ready(function () {
    $(window).on('keypress', e => {
        if (e.keyCode === KEY.ESCAPE) {
            hideDialog();
        }
    });

    $('#plus').click(function () {
        showEditDialog(this);
    });

    $('.display').click(function () {
        showEditDialog(this);
    });
});

const KEY = {
    ESCAPE: 27,
    ENTER: 13
};

const TITLE_ID = '#titel';
const STATUS_ID = '#stand';

const REGEX_S = '^S[0-9]{2}E[0-9]{2}$';
const REGEX_E = '^E[0-9]{5}$';
const REGEX_X = '^(SxxE|Exxx)xx$';


const SUBMIT_ID = '#submit';
const EUP_ID = '#EUP';
const SUP_ID = '#SUP';

let uploaded = false;

// Cache variables
let image = null;
let title = null;
let state = null;
let oldStand = '';

const dark = 'dark';
const light = 'light';

// -----------------------------------------------------------------------------------------------------------------
// Info Dialog -----------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------

let overlayDisplayed = false;

function showDialog(target, callback) {
    $('#overlay').load(target, () => {
        $('#bg').on('click', hideDialog);
        callback();
    });
    $('#overlay').css('display', 'block');
    disableScroll();
    overlayDisplayed = true;
}

function showHideInfoDialog() {
    if (overlayDisplayed) {
        hideDialog();
    } else {
        showDialog('dialog_info.html', () => {
            $('#changestyle').click(() => {
                $('body').toggleClass(dark);
                $('body').toggleClass(light);

                if ($('body').hasClass(light)) {
                    setCookie('theme', light);
                } else {
                    setCookie('theme', dark);
                }
            });
        });
    }
}

function showEditDialog(button) {
    showDialog('dialog_edit.html', () => {
        show(button);
        updateImage();
        updateButtons();
    });
}

function hideDialog() {
    $('#overlay').css('display', 'none');
    enableScroll();
    overlayDisplayed = false;
}

function updateImage() {
    if (image && image !== '') {
        $('#pic').attr('src', image);
        $('#pic').css('display', 'inline-block');
        $('#drop_zone').css('display', 'none');
    } else {
        $('#pic').css('display', 'none');
        $('#drop_zone').css('display', 'inline-block');
    }
}

// Scroll Handling

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    let keys = {37: 1, 38: 1, 39: 1, 40: 1};
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) { // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    }
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    }
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

// ------------------------------------------------------------------
// Edit Dialog ------------------------------------------------------
// ------------------------------------------------------------------


function show(btn) {
    setData();
    let titel_ = $(btn).attr('id');
    uploaded = false;
    if (titel_ === 'plus') {
        setVariables(null, null, null);
        $(TITLE_ID).prop('readonly', false);
        oldStand = '';
        $(TITLE_ID).focus();
    } else {
        // /g - search all
        let title = titel_.replace(/_/g, ' ');
        setVariables(title, series[title].status, series[title].image);
        oldStand = state;
        $(TITLE_ID).prop('readonly', true);
        $(STATUS_ID).focus();
    }
}

function setData() {
    document.getElementById('pic').addEventListener('dragover', handleDragOver, false);
    document.getElementById('pic').addEventListener('drop', handleFileSelect, false);
    document.getElementById('drop_zone').addEventListener('dragover', handleDragOver, false);
    document.getElementById('drop_zone').addEventListener('drop', handleFileSelect, false);

    $(TITLE_ID).change(titleChanged);

    $(TITLE_ID).keyup(function (e) {
        titleChanged();
        if (e.keyCode === KEY.ENTER) {
            $(STATUS_ID).focus();
        }
    });

    $(STATUS_ID).change(statusChanged);

    $(STATUS_ID).keyup(function (e) {
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
        setStatus($(STATUS_ID).val());

        // send stuff
        persistSerie(title, state, oldStand);
        persistImage(uploaded, title, image);
        refresh();
        hideDialog();
    });

    $('#delete').click(() => clickEvent(archive));

    $('#close').click(hideDialog);

    $(SUP_ID).click(() => clickEvent(buildSE));

    $(EUP_ID).click(() => clickEvent(buildE));
}

function titleChanged() {
    setTitle();
    let serie = null;
    if (document.getElementById('titel').checkValidity()) {
        serie = series[title];
    }
    if (serie) {
        // serie is already known
        setImage(serie.image);
        setStatus(serie.status);
        $(STATUS_ID).val(serie.status);
        uploaded = false;
    } else {
        if (!uploaded) {
            setImage(null);
        }
        setStatus(null);
        $(STATUS_ID).val('');
    }
    updateImage();
}

function statusChanged() {
    setStatus($(STATUS_ID).val());
    updateButtons();
}

function clickEvent(builder) {
    setStatus($(STATUS_ID).val());
    if (document.getElementById('stand').checkValidity()) {
        // increment episode
        setStatus(builder());
        $(STATUS_ID).val(state);
        $(STATUS_ID).focus();
    }
    updateButtons();
}

function buildE() {
    let episode = state.split('E')[1];
    let epSize = episode.length;
    episode = parseInt(episode);
    episode++;
    episode = episode.pad(epSize);
    let s = state.split('E')[0];
    s = s + 'E' + episode;
    return s;
}

function buildSE() {
    let s;
    let season = state.split('E')[0];
    if (state.match(REGEX_S)) {
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
    if (state.match(REGEX_S)) {
        s = 'SxxExx';
    }
    return s;
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
        reader.onload = (function () {
            return function (e) {
                // Render thumbnail
                setImage(e.target.result);
                updateImage();
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

/**
 * Updates the cache variables
 * @param t
 * @param s
 * @param i
 */
function setVariables(t, s, i) {
    title = t;
    state = s;
    image = i;
    $(STATUS_ID).val(state ? state : '');
    $(TITLE_ID).val(title ? title : '');
}

function setStatus(s) {
    state = s;
    if (state) {
        state = state.trim();
    }
}

function setTitle() {
    title = $(TITLE_ID).val();
    if (title) {
        title = title.trim();
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
    setStatus($(STATUS_ID).val());
    let sup = $(SUP_ID);
    let eup = $(EUP_ID);
    let submit = $(SUBMIT_ID);

    if (state && document.getElementById('stand').checkValidity()) {
        enable(sup);
        enable(eup);
        enable(submit);

        if (state.match(REGEX_E)) {
            disable(sup);
        }
        if (state.match(REGEX_X)) {
            disable(sup);
            disable(eup);
        }
    } else {
        disable(sup);
        disable(eup);
        disable(submit);
    }

    if (document.getElementById('titel') && !document.getElementById('titel').checkValidity()) {
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
