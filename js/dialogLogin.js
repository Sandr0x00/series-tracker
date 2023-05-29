/* global seriesComp, dialogLogin */

import {html} from 'lit';
import { DialogComp } from './dialog.js';

const KEY = {
    ENTER: 13
};

export class DialogLoginComp extends DialogComp {

    static get properties() {
        return {
            submitEnabled: Boolean,
            username: String,
            password: String,
            result: Object
        };
    }

    constructor() {
        super();
        this.result = html``;
    }

    show() {
        super.show();
        dialogLogin.showModal();
    }

    close() {
        super.close();
        dialogLogin.close();
    }

    render() {
        return html`
${this.result}
<form id="form" class="grid grid-cols-1 gap-2" action="javascript:void(0);" @submit=${this.postLogin}>
    <input id="username" name="username" type="text" pattern="[a-zA-Z0-9\-]*" required placeholder="Username" autocomplete="off" @input=${() => this.loginUpdateSubmit()} @keyup=${(e) => {
        if (e.keyCode === KEY.ENTER) {
            document.getElementById('password').focus();
        }
    }}>

    <input id="password" name="password" type="password" required placeholder="Password" autocomplete="off" @input=${() => this.loginUpdateSubmit()} @keyup=${(e) => {
        if (e.keyCode === KEY.ENTER) {
            this.postLogin();
        }
    }}>

    <button id="submit" type="submit" ?disabled=${!this.submitEnabled}>
        <i class="fas fa-check fa-2x"></i>
    </button>
</form>`;
    }

    loginUpdateSubmit() {
        this.username = document.getElementById('username').value;
        this.password = document.getElementById('password').value;
        this.submitEnabled = this.username && this.password;
    }

    postLogin() {
        if (!this.submitEnabled) {
            return;
        }
        fetch('login', {
            method: 'post',
            body: JSON.stringify({
                username: this.username,
                password: this.password
            })
        }).then(response => {
            if (response.status === 200) {
                this.result = html``;
                this.close();
                seriesComp.loadStuff();
            } else if (response.status === 401) {
                this.result = html`<div class="offset-sm-2 col col-sm-8 alert error">Wrong Username or Password.</div>`;
            } else {
                document.querySelector('dialog-error').show('Fucked up');
            }
        });

    }
}

customElements.define('dialog-login', DialogLoginComp);