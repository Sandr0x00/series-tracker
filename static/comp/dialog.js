/* global headerComp */

import {html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {BaseComp} from './base.js';
import './dialogEdit.js';
import './dialogInfo.js';
import './dialogError.js';
import './dialogLogin.js';

export class DialogComp extends BaseComp {

    static get properties() {
        return {
            dialogNr: Number,
            dialog: String,
        };
    }

    constructor() {
        super();
        this.dialog = '';
        this.dialogNr = 0;
    }

    showDialog() {
        headerComp.stopAutoload();
    }

    showEdit(id, title, status, image) {
        if (this.dialogNr !== 0) {
            return;
        }
        headerComp.disable();
        this.showDialog();
        this.dialogNr = 1;
        this.dialog = html`<dialog-edit .id=${id} .title=${title} .status=${status} .imageUrl=${image}></dialog-edit>`;
    }

    showInfo() {
        if (this.dialogNr === 2) {
            this.close();
        } else if (this.dialogNr === 0) {
            this.dialog = html`<dialog-info></dialog-info>`;
            this.dialogNr = 2;
            this.showDialog();
        }
    }

    showLogin() {
        if (this.dialogNr !== 0) {
            return;
        }
        headerComp.disable();
        this.showDialog();
        this.dialogNr = 3;
        this.dialog = html`<dialog-login></dialog-login>`;
    }

    showError(error) {
        if (this.dialogNr !== 0) {
            return;
        }
        this.showDialog();
        this.dialogNr = 4;
        this.dialog = html`<dialog-error .error=${error}></dialog-error>`;
    }

    close(force) {
        if (!force && this.dialogNr === 3) {
            return;
        }
        this.dialog = '';
        this.dialogNr = 0;
        headerComp.enable();
        headerComp.startAutoload();
        console.log('TODO: Scrollhandling');
        // TODO: scrollhandling
    }

    render() {
        if (this.dialog === '') {
            return html``;
        } else {
            return html`
<div id="bg" class="bg" @click=${() => this.close(false)}></div>
  <div id="overlay" class="container-fluid">${this.dialog}</div>
</datalist>`;
        }
    }
}

customElements.define('dialog-comp', DialogComp);