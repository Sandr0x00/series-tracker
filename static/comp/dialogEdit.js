/* global seriesComp, dialogComp */

import {html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {BaseComp} from './base.js';

const KEY = {
    ESCAPE: 27,
    ENTER: 13
};

const REGEX_S = '^S[0-9]{2}E[0-9]{2}$';
const REGEX_E = '^E[0-9]{5}$';
// const REGEX_X = '^(SxxE|Exxx)xx$';

Number.prototype.pad = function (size) {
    let s = String(this);
    while (s.length < size) {
        s = '0' + s;
    }
    return s;
};

export class DialogEditComp extends BaseComp {

    static get properties() {
        return {
            id: String,
            title: String,
            status: String,
            image: String,
            imageUrl: String,
            supEnabled: Boolean,
            eupEnabled: Boolean,
            submitEnabled: Boolean,
            error: String,
            username: String,
            password: String
        };
    }

    constructor() {
        super();
    }

    close() {
        dialogComp.close();
    }

    postSeries() {
        if (!document.getElementById('title').checkValidity() || !document.getElementById('status').checkValidity()) {
            return;
        }
        this.postImage();

        let series = {
            Id: this.id,
            Title: this.title,
            Status: this.status
        };

        fetch('api/series', {
            method: 'post',
            body: JSON.stringify(series)
        }).then(response => {
            if (response.status === 200) {
                this.close();
                return response.json();
            }
            dialogComp.showError('Fucked up');
            return null;
        }).then(data => {
            if (data) {
                seriesComp.data = seriesComp.setData(data);
                seriesComp.lazyLoadImg();
            }
        });
    }

    postImage() {
        let formData = new FormData();
        formData.append('file', this.image);
        formData.append('id', this.id);

        fetch('api/image', {
            method: 'post',
            body: formData,
        }).then(function(response) {
            console.log(`TODO: handle response ${response}`);
        });
    }

    render() {
        return html`
<div id="dialog" class="col-12 col-sm-12 offset-md-2 col-md-8 offset-lg-2 col-lg-8 offset-xl-3 col-xl-6">
    <div class="row">
        <div class="col-8 offset-2">
            ${this.image ? html`<img id="pic" src="${this.image}" @dragover=${this.handleDragOver} @drop=${this.handleFileSelect}/>` : html`<div id="drop_zone" @dragover=${this.handleDragOver} @drop=${this.handleFileSelect}>Serien Bild</div>`}
        </div>
        <div class="col-2">
            <button id="close" class="btn btn-link" type="button" @click=${this.close}>
            <i class="fas fa-times fa-2x"></i>
            </button>
        </div>
    </div>
    <form id="form" action="javascript:void(0);">
        <div id="row-titel" class="row">
            <div class="offset-sm-2 col-10 col-sm-8">
                <input id="title" name="titel" type="text" pattern="[a-zA-Z0-9]+([a-zA-Z0-9 \-]*[a-zA-Z0-9\-])*" required placeholder="Titel" autocomplete="off" list="titelList" ?readonly=${this.id ? true : false} .value=${this.title ? this.title : ''} @keyup=${(e) => {
    this.titleChanged();
    if (e.keyCode === KEY.ENTER) {
        document.getElementById('status').focus();
    } else if (e.keyCode === KEY.ESCAPE) {
        this.close();
    }
}} @change=${this.titleChanged}>
            </div>
            <div class="col-2">
                <button id="delete" class="btn btn-link" type="button" @click=${this.archive}>
                    <i class="fas fa-trash-alt fa-2x"></i>
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-2">
                <button id="SUP" class="btn btn-link" type="button" @click=${this.buildSE} ?disabled=${!this.supEnabled}>
                    <i class="fas fa-plus fa-2x"></i>
                </button>
            </div>
            <div class="col-8">
                <input id="status" name="stand" type="text" pattern="^((S|B)[0-9x]{2}E[0-9x]{2}|E[0-9x]{5})$" required placeholder="N&auml;chste Episode" autocomplete="off" .value=${this.status ? this.status : ''} @keyup=${(e) => {
    this.statusChanged();
    if (e.keyCode === KEY.ENTER) {
        this.postSeries();
    } else if (e.keyCode === KEY.ESCAPE) {
        this.close();
    }
}} @change=${this.statusChanged}>
            </div>
            <div class="col-2">
                <button id="EUP" class="btn btn-link" type="button" @click=${this.buildE} ?disabled=${!this.eupEnabled}>
                    <i class="fas fa-plus fa-2x"></i>
                </button>
            </div>
        </div>
        <div class="row">
            <div class="offset-md-2 col col-md-8">
                <button id="submit" class="btn btn-link" type="button" @click=${this.postSeries} ?disabled=${!this.submitEnabled}>
                    <i class="fas fa-check fa-2x"></i>
                </button>
            </div>
        </div>
    </form>
</div>`;
    }

    firstUpdated() {
        fetch(this.imageUrl, {
            method: 'get',
        }).then((response) => {
            if (response.status === 200) {
                this.image = this.imageUrl;
            } else {
                this.image = null;
            }
        });
    }

    titleChanged() {
        this.title = document.getElementById('title').value;
    }

    buildE() {
        let episode = this.status.split('E')[1];
        let epSize = episode.length;
        episode = parseInt(episode);
        episode++;
        episode = episode.pad(epSize);
        let s = this.status.split('E')[0];
        s = s + 'E' + episode;
        this.status = s;
    }

    buildSE() {
        let s;
        let season = this.status.split('E')[0];
        if (this.status.match(REGEX_S)) {
            season = season.split('S')[1];
            s = 'S';
        }
        season = parseInt(season);
        season++;
        season = season.pad(2);
        s = s + season + 'E01';
        this.status = s;
    }

    archive() {
        let s = 'Exxxxx';
        if (this.status.match(REGEX_S)) {
            s = 'SxxExx';
        }
        this.status = s;
    }

    handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        let files = evt.dataTransfer.files; // FileList object

        for (let i = 0, f; i < files.length; i++) {
            f = files[i];
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            // Closure to capture the file information.
            new Promise((resolve) => {
                let reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                // Read in the image file as a data URL.
                reader.readAsDataURL(f);
            }).then(r => {
                this.image = r;
            });
        }
    }

    updated(changedProperties) {
        if (changedProperties.has('title')) {
            this.updateButtons();
        } else if (changedProperties.has('status')) {
            this.updateButtons();
        }
        if (changedProperties.has('dialog')) {
            if (this.dialog === 1) {
                if (!this.title) {
                    document.getElementById('title').focus();
                } else {
                    document.getElementById('status').focus();
                }
            }
        }
    }

    handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    statusChanged() {
        this.status = document.getElementById('status').value;
        this.updateButtons();
    }

    updateButtons() {
        if (this.status && document.getElementById('status').checkValidity()) {
            if (this.status.match(REGEX_E)) {
                this.eupEnabled = true;
                this.supEnabled = false;
            } else if (this.status.match(REGEX_S)) {
                this.eupEnabled = true;
                this.supEnabled = true;
            } else {
                this.eupEnabled = false;
                this.supEnabled = false;
            }
            this.submitEnabled = true;
        } else {
            this.eupEnabled = false;
            this.supEnabled = false;
            this.submitEnabled = false;
        }

        if (document.getElementById('title') && !document.getElementById('status').checkValidity()) {
            this.submitEnabled = false;
        }
    }
}

customElements.define('dialog-edit', DialogEditComp);