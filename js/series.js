/* global dialogComp, loadingComp */

import {html} from 'lit-element';
import {BaseComp} from './base.js';
import $ from 'jquery';
import { getCookie, setCookie } from './cookies.js';

class Series extends BaseComp {

    static get properties() {
        return {
            data: Object,
            filteredData: Object,
            dataFilter: Array
        };
    }

    constructor() {
        super();
        loadingComp.open();
        this.data = {};
        this.dataFilter = [getCookie('filter') !== '', ''];
        this.filteredData = {};
        this.loadStuff();
    }

    render() {
        return html`${Object.values(this.filteredData).map(i => html`${this.single(i)}`)}`;
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

    filter() {
        console.log(this.dataFilter);
        if (this.dataFilter[0]) {
            this.filteredData = Object.fromEntries(Object.entries(this.data).filter(s => !s[1].finished));
        } else {
            this.filteredData = this.data;
        }
        if (this.dataFilter[1]) {
            this.filteredData = Object.fromEntries(Object.entries(this.filteredData).filter(s => s[1].title.toLowerCase().includes(this.dataFilter[1].toLowerCase())));
        }
    }

    updated(changedProperties) {
        if (changedProperties.has('dataFilter')) {
            this.filter();
            setCookie('filter', this.dataFilter[0]);
        } else if (changedProperties.has('data')) {
            this.filter();
        } else if (changedProperties.has('filteredData')) {
            this.lazyLoadImg();
        }
    }

    async lazyLoadImg(){
        for (const elem in this.filteredData) {
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
  <a class="series placeholder display ${s.finished ? 'grayscale' : ''}" id="${s.id}" @click=${() => dialogComp.showEdit(s.id, s.title, s.status, s.img)} data-toggle="tooltip" data-original-title="${s.title}" data-large="${s.img}">
    <span class="shadow" id="${s.id}_status">${s.status}</span>
  </a>
</div>`;
    }

    map({ImdbID, Title, Status}) {
        return {
            id: ImdbID,
            title: Title,
            status: Status,
            img: `/img/${ImdbID}.jpg`,
            finished: Status.match('^(SxxE|Exxx)xx$') != null
        };
    }

    setData(series) {
        let mapped = series.map(a => this.map(a));
        return mapped.reduce((m, o) => {
            m[o.id] = o;
            return m;
        }, {});
    }

    loadStuff() {
        fetch('/api/series').then(response => {
            if (response.status === 401) {
                dialogComp.close(true);
                dialogComp.showLogin();
                return Promise.reject(null);
            }
            return response;
        }).then(response => response.json()
        ).then(series => this.setData(series)
        ).then(data => {
            loadingComp.close();
            this.data = data;
        }).catch(err => {
            if (err) {
                loadingComp.close();
                dialogComp.showError(err);
            }
        });
    }
}

customElements.define('series-comp', Series);