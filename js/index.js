/* global dialogLogin, loadingDialog */

import './jquery-global.js';

import './cookies.js';
import '@popperjs/core';
import './header.js';
import './series.js';
import './fuzzy_search.js';
import './dialogEdit.js';
import './dialogError.js';
import './dialogInfo.js';
import './dialogLogin.js';

function preventCancel(event) {
    event.preventDefault();
}

loadingDialog.addEventListener('cancel', preventCancel);
dialogLogin.addEventListener('cancel', preventCancel);

