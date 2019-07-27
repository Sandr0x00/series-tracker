/* global dialogComp */

import {html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {BaseComp} from './base.js';

class Series extends BaseComp {

    static get properties() {
        return {
            data: Array
        };
    }

    constructor() {
        super();
        dialogComp.showError('Loading');
        this.data = [];
        this.loadStuff();
    }

    render() {
        let draw = html`
        ${Object.values(this.data).map(i => html`${this.single(i)}`)}`;
        return draw;
    }

    lazyImg(img) {
        return new Promise((resolve) => {
            let bgImg = new Image();
            bgImg.onload = () => {
                resolve(img);
            };
            bgImg.onerror = () => {
                resolve('/img/unknown.jpg');
            };
            bgImg.src = img;
        });
    }

    updated(changedProperties) {
        if (changedProperties.has('data')) {
            this.lazyLoadImg();
            // $('.placeholder').css('background-image', 'url(' + '/img/unknown.jpg' + ')');

            $('[data-toggle="tooltip"]').tooltip({
                placement: 'top',
                container: 'body',
                offset: '0, -100%',
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
            });
        }
    }


    async lazyLoadImg(){//changedProperties) {
        for (const elem in this.data) {
            let bgImg = new Image();
            bgImg.onload = () => {
                $('#' + elem).css('background-image', 'url(' + this.data[elem].img + ')');
            };
            bgImg.onerror = () => {
                $('#' + elem).css('background-image', 'url(' + '/img/unknown.jpg' + ')');
            };
            bgImg.src = this.data[elem].img;
        }

        $('[data-toggle="tooltip"]').tooltip({
            placement: 'top',
            container: 'body',
            offset: '0, -100%',
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
        });
    }

    single(s) {
        return html`
<div id="${s.id}_div" class="seriesDiv col-xs-6 col-sm-3 col-md-2 col-lg-2 col-xl-1">
<a class="series placeholder display ${s.status.match('^(SxxE|Exxx)xx$') ? 'grayscale' : ''}" id="${s.id}" @click=${() => dialogComp.showEdit(s.id, s.title, s.status, s.img)} data-toggle="tooltip" data-original-title="${s.title}" data-large="${s.img}">
    <span class="shadow" id="${s.id}_status">${s.status}</span>
</a>
</div>`;
    }

    map({Id, Title, Status}) {
        return {
            id: Id,
            title: Title,
            status: Status,
            img: `/img/${Id}.jpg`
        };
    }

    setData(series) {
        // this.lazyLoadImg();
        let mapped = series.map(a => this.map(a));
        return mapped.reduce((m, o) => {
            m[o.id] = o;
            return m;
        }, {});
    }

    loadStuff() {
        fetch('/api/series')
            .then(response => {
                if (response.status === 401) {
                    dialogComp.showLogin();
                    return Promise.reject(null);
                }
                return response;
            })
            .then(response => response.json())
            .then(series => this.setData(series))
            .then(data => {
                dialogComp.close();
                this.data = data;
            }).catch(err => {
                if (err) {
                    dialogComp.showError(err);
                }
            });
    }
}

customElements.define('all-series', Series);