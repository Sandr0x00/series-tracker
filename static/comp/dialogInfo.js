/* global dialogComp */

import {html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {BaseComp} from './base.js';

export class DialogInfoComp extends BaseComp {

    static get properties() {
        return {
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
    <div id="dialog" class="offset-sm-4 offset-md-8 col-md-4 col-sm-8" style="text-align: left">
        Style:<br>
        <a id="changestyle" @click=${() => {
        const dark = 'dark';
        const light = 'light';
        $('body').toggleClass(dark);
        $('body').toggleClass(light);

        if ($('body').hasClass(light)) {
            this.setCookie('theme', light);
        } else {
            this.setCookie('theme', dark);
        }
    }}>Switch Style</a><br><br>
        Stuff used:<br>
        <a target="_blank" href="https://fontawesome.com/">FontAwesome</a>,
        <a target="_blank" href="https://getbootstrap.com/">Bootstrap</a>,
        <a target="_blank" href="https://jquery.com/">JQuery</a>,
        <a target="_blank" href="https://lit-element.polymer-project.org/">LitElement</a><br>
        <br>
        Download status: <a href="server/get_status.php">status.txt</a><br/>
        Upload status: <form id="upload_status" action="server/post_status_file.php" method="post" enctype="multipart/form-data"><input type="file" name="file" id="file"><input class="submit" type="submit" value="Upload" name="submit"></form>
        <br>
        Made by <a href="https://github.com/Sandr00">Sandr0</a>
</div>`;
    }

    setCookie(cname, cvalue) {
        let d = new Date();
        d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
        let expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires;
    }
}

customElements.define('dialog-info', DialogInfoComp);