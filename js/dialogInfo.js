/* global dialogInfo */

import { html } from 'lit';
import { DialogComp } from './dialog.js';

export class DialogInfoComp extends DialogComp {

    static get properties() {
        return {
        };
    }

    constructor() {
        super();
    }

    show() {
        super.show();
        dialogInfo.showModal();
    }

    close() {
        super.close();
        dialogInfo.close();
    }

    render() {
        return html`
    <div class="text-end">
        <button id="close" class="rounded btn-link" type="button" @click=${this.close}>
        <i class="fas fa-times fa-2x"></i>
        </button>
    </div>
    <div class="text-start">
        Made with <i class="fas fa-heart"></i> using:<br>
        <a target="_blank" href="https://fontawesome.com/">FontAwesome <i class="fas fa-external-link-alt"></i></a>,
        <a target="_blank" href="https://getbootstrap.com/">Bootstrap <i class="fas fa-external-link-alt"></i></a>,
        <a target="_blank" href="https://jquery.com/">JQuery <i class="fas fa-external-link-alt"></i></a>,
        <a target="_blank" href="https://lit.dev/">Lit <i class="fas fa-external-link-alt"></i></a><br>
        <br>
        Download status: <a href="api/series?b64" download="status.txt">status.txt</a>
        <!--<br/>Upload status: <form id="upload_status" action="server/post_status_file.php" method="post" enctype="multipart/form-data"><input type="file" name="file" id="file"><input class="submit" type="submit" value="Upload" name="submit"></form>-->
        <br>
        Contribute at <a href="https://github.com/Sandr0x00/SerienTracker">GitHub</a>
</div>`;
    }
}

customElements.define('dialog-info', DialogInfoComp);