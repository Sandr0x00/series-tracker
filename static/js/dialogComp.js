import {html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {Base} from './base.js';

const KEY = {
    ESCAPE: 27,
    ENTER: 13
};

const REGEX_S = '^S[0-9]{2}E[0-9]{2}$';
const REGEX_E = '^E[0-9]{5}$';
const REGEX_X = '^(SxxE|Exxx)xx$';

Number.prototype.pad = function (size) {
    let s = String(this);
    while (s.length < size) {
        s = '0' + s;
    }
    return s;
};

export class DialogComp extends Base {

    static get properties() {
        return {
            id: String,
            title: String,
            status: String,
            imageLocation: String,
            dialog: Number,
            supEnabled: Boolean,
            eupEnabled: Boolean,
            submitEnabled: Boolean
        };
    }

    constructor() {
        super();
        this.dialog = 0;
    }

    showEdit(id, title, status, imageLocation) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.imageLocation = imageLocation;
        this.dialog = 1;
        this.eupEnabled = this.supEnabled = true;
    }

    showInfo() {
        this.dialog = 2;
    }

    post() {
        console.log(document.getElementById('title').checkValidity());
        console.log(document.getElementById('status').checkValidity());

        // update everything
        // setTitle();
        // setStatus($(STATUS_ID).val());

        // // send stuff
        // persistSerie(title, state, oldStand);
        // persistImage(uploaded, title, image);
        // refresh();
        // hideDialog();
        // $.ajax({
        // 	type: 'POST',
        // 	url: '/api/series',
        // 	data: {
        // 		Id: this.id,
        // 		Title: this.title,
        // 		Status: this.state
        // 	},
        // 	success: function(data) {
        // 		if (data == null || data === '') {
        // 			return false;
        // 		}
        // 		showInfoDialog('dialog_error.html');
        // 		$('#error-dialog').html('Fehler:<br>' + data);

        // 		// this would return to the error handler, which does nothing
        // 		return false;
        // 	}
        // });
    }

    close() {
        this.dialog = 0;
        // TODO: scrollhandling
    }


    render() {
        console.log(this.status);
        if (this.dialog === 0) {
            return html``;
        } else {
            let d = null;
            switch (this.dialog) {
                case 1:
                    d = this.editTemplate;
                    break;
                case 2:
                    d = this.infoTemplate;
                    break;
                case 3:
                    d = this.errorTemplate;
                    break;
                default:
                    return html`Somthing went wrong.`;
            }
            this.editTemplate;
            return html`
<div id="bg" class="bg" @click=${this.close}></div>
    <div id="overlay" class="container-fluid">${d}</div>
    <datalist id="titelList">
    <!--?php
        foreach ($titelList as $element) {
            echo "<option value='$element'/>";
        }
    ?-->
</datalist>`;
        }
    }


    get editTemplate() {
        // TODO: focus title on plus, else status
        return html`
<div id="dialog" class="col-12 col-sm-12 offset-md-2 col-md-8 offset-lg-2 col-lg-8 offset-xl-3 col-xl-6">
    <div class="row">
        <div class="col-8 offset-2">
            ${this.imageLocation ? html`<img id="pic" src="${this.imageLocation}" @dragover=${this.handleDragOver} @drop=${this.handleFileSelect}/>` : html`<div id="drop_zone" @dragover=${this.handleDragOver} @drop=${this.handleFileSelect}>Serien Bild</div>`}

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
        this.post();
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
                <button id="submit" class="btn btn-link" type="button" @click=${this.post} ?disabled=${!this.submitEnabled}>
                    <i class="fas fa-check fa-2x"></i>
                </button>
            </div>
        </div>
    </form>
</div>`;
    }

    get infoTemplate() {
        return html`
<div class="d-flex align-items-end flex-column p-5" >
    <div id="dialog" style="text-align: left">
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
        Google Material Icons: <a target="_blank" href="https://material.io/icons/">https://material.io/icons/</a><br>
        Bootstrap: <a target="_blank" href="https://v4-alpha.getbootstrap.com/">https://v4-alpha.getbootstrap.com/</a><br>
        JQuery: <a target="_blank" href="https://jquery.com/">https://jquery.com/</a><br>
        JQuery Lazy: <a target="_blank" href="http://jquery.eisbehr.de/lazy/">http://jquery.eisbehr.de/lazy/</a><br>
        <br>
        Download status: <a href="server/get_status.php">status.txt</a><br/>
        Upload status: <form id="upload_status" action="server/post_status_file.php" method="post" enctype="multipart/form-data"><input type="file" name="file" id="file"><input class="submit" type="submit" value="Upload" name="submit"></form>
        <br>
        Made by <a href="https://github.com/Sandr00">Sandr0</a>
    <!-- </div> -->
</div>`;
    }

    setCookie(cname, cvalue) {
        let d = new Date();
        d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
        let expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires;
    }

    get errorTemplate() {
        return html`
<div id="dialog">
    <div class="d-flex align-items-end flex-column" style="height: 200px; position:fixed; top: 110px; right: 20px; z-index: 5;">
        <div id="error-dialog" class="p-5 dialog" style="text-align: left">
        </div>
    </div>
</div>`;
    }



    titleChanged() {
        this.title = document.getElementById('title').value;
        // TODO: already known
        // if (serie) {
        //     // serie is already known
        //     setImage(serie.image);
        //     setStatus(serie.status);
        //     $(STATUS_ID).val(serie.status);
        //     uploaded = false;
        // } else {
        //     if (!uploaded) {
        //         setImage(null);
        //     }
        //     setStatus(null);
        //     $(STATUS_ID).val('');
        // }
        // updateImage();
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
        // TODO: upload to server
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
                this.imageLocation = r;
            });
        }
    }

    handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // show(btn) {
    // 	setData();
    // 	let titel_ = $(btn).attr('id');
    // 	uploaded = false;
    // 	if (titel_ === 'plus') {
    // 		oldStand = '';
    // 		$(TITLE_ID).focus();
    // 	} else {
    // 		// /g - search all
    // 		let title = titel_.replace(/_/g, ' ');
    // 		oldStand = state;
    // 		$(STATUS_ID).focus();
    // 	}
    // }
    statusChanged() {
        // TODO: fix when opening
        this.status = document.getElementById('status').value;
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


    // setImage(i) {
    // 	image = i;
    // }


    // close() {
    // 	$('#overlay').css('display', 'none');
    // 	enableScroll();
    // 	overlayDisplayed = false;
    // }


    // persistSerie(title, state, oldStand) {
    // 	if (oldStand !== state) {
    // 		// send the data using post
    // 		$.ajax({
    // 			type: 'POST',
    // 			url: 'server/post_series.php',
    // 			data: {
    // 				titel: title,
    // 				stand: state
    // 			},
    // 			success: function(data) {
    // 				if (data == null || data === '') {
    // 					return false;
    // 				}
    // 				showInfoDialog('dialog_error.html');
    // 				$('#error-dialog').html('Fehler:<br>' + data);

    // 				// this would return to the error handler, which does nothing
    // 				return false;
    // 			}
    // 		});
    // 	}
    // }

}

customElements.define('dialog-overlay', DialogComp);