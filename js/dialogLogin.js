/* global seriesComp, dialogComp */

import {html} from 'lit-element';
import {BaseComp} from './base.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

const KEY = {
    ESCAPE: 27,
    ENTER: 13
};

export class DialogLoginComp extends BaseComp {

    static get properties() {
        return {
            submitEnabled: Boolean,
            username: String,
            password: String,
            result: String
        };
    }

    constructor() {
        super();
        this.result = '';
    }

    close() {
        dialogComp.close(true);
    }

    render() {
        return html`
<div id="dialog" class="col-12 col-sm-12 offset-md-2 col-md-8 offset-lg-2 col-lg-8 offset-xl-3 col-xl-6">
    ${unsafeHTML(this.result)}
    <form id="form" action="javascript:void(0);" @submit=${this.postLogin}>
        <div id="row-titel" class="row">
            <div class="offset-sm-2 col col-sm-8">
                <input id="username" name="username" type="text" pattern="[a-zA-Z0-9\-]*" required placeholder="Username" autocomplete="off" @keyup=${(e) => {
        this.loginUpdateSubmit();
        if (e.keyCode === KEY.ENTER) {
            document.getElementById('password').focus();
        }
    }}>
            </div>
        </div>
        <div class="row">
            <div class="offset-sm-2 col col-sm-8">
                <input id="password" name="password" type="password" required placeholder="Password" autocomplete="off" @keyup=${(e) => {
        this.loginUpdateSubmit();
        if (e.keyCode === KEY.ENTER) {
            this.postLogin();
        }
    }}>
            </div>
        </div>
        <div class="row">
            <div class="offset-sm-2 col col-sm-8">
                <button id="submit" class="btn btn-link" type="submit" ?disabled=${!this.submitEnabled}>
                    <i class="fas fa-check fa-2x"></i>
                </button>
            </div>
        </div>
    </form>
</div>`;
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
                this.result = '';
                this.close();
                seriesComp.loadStuff();
            } else if (response.status === 401) {
                this.result = '<div class="row"><div class="offset-sm-2 col col-sm-8 alert error">Wrong Username or Password.</div></div>';
            } else {
                console.log('Fucked up');
                // this.showError('Fucked up');
            }
        });

    }
}

customElements.define('dialog-login', DialogLoginComp);