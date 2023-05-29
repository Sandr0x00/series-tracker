/* global headerComp, loadingDialog */

import {BaseComp} from './base.js';

export class DialogComp extends BaseComp {

    static get properties() {
        return {
        };
    }

    constructor() {
        super();
    }

    show() {
        loadingDialog.close();
        headerComp.disable();
        headerComp.stopAutoload();
    }

    close() {
        headerComp.enable();
        headerComp.startAutoload();
    }

}
