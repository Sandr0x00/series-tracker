/* global dialogComp */

import {html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {BaseComp} from './base.js';

export class DialogErrorComp extends BaseComp {

    static get properties() {
        return {
            error: String,
        };
    }

    constructor() {
        super();
    }

    close() {
        dialogComp.close();
    }

    render() {
        return html`
<div id="dialog" class="col-12 col-sm-12 offset-md-2 col-md-8 offset-lg-2 col-lg-8 offset-xl-3 col-xl-6">
    <div class="row">
        <div id="error-dialog" class="p-5 dialog" style="text-align: left">
        ${this.error}
        </div>
    </div>
</div>`;
    }

}

customElements.define('dialog-error', DialogErrorComp);