/* global dialogError */

import {html} from 'lit';
import { DialogComp } from './dialog.js';

export class DialogErrorComp extends DialogComp {

    static get properties() {
        return {
            error: String,
        };
    }

    constructor() {
        super();
    }

    show(error) {
        super.show();
        this.error = error;
        if (dialogError.open) {
            dialogError.close();
        }
        dialogError.showModal();
    }

    close() {
        super.close();
        dialogError.close();
    }

    render() {
        return html`
<div class="text-end">
    <button id="close" class="rounded btn-link" type="button" @click=${this.close}>
        <i class="fas fa-times fa-2x"></i>
    </button>
</div>

<div class="text-start p-5">
    ${this.error}
</div>`;
    }
}

customElements.define('dialog-error', DialogErrorComp);