import {html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {Base} from './base.js';
import './dialogComp.js';
import './headerComp.js';

class Series extends Base {

    static get properties() {
        return {
            message: String,
            data: Array,
            id: String,
            title: String,
            status: String
        };
    }

    constructor() {
        super();
        this.message = 'Loading';
        this.data = [];
        this.addEventListener('data-loaded', (e) => {
            this.data = e.detail;
            this.message = '';
        } );
        this.loadStuff();
    }

    openDialog(id, title, status) {
        document.getElementById('overlayContent').showEdit(
            id, title, status, null
        );
    }

    render() {
        return html`
        <header-comp></header-comp>
        ${this.message}
        ${this.data.map(i => html`${i}`)}
        <dialog-overlay id="overlayContent"></dialog-overlay>

        `;
    }

    loadStuff() {
        let product = ({ Id, Title, Status }) => {
            return html`
<div id="${Id}_div" class="seriesDiv col-xs-6 col-sm-3 col-md-2 col-lg-2 col-xl-1">
    <a class="series lazy display" id="${Id}" @click=${() => document.getElementById('overlayContent').showEdit(Id, Title, Status, null)} data-toggle="tooltip" data-original-title="${Title}">
        <span class="shadow" id="${Id}_status">${Status}</span>
    </a>
</div>
`;
        };
        fetch('/api/series')
            .then(response => response.json())
            .then(products => {
                console.log(products);
                return products.map(product);
            })
            .then(data => {
                this.dispatchEvent(new CustomEvent('data-loaded', {
                    detail: data
                }));
            });
        // .then(templateResult =>
        // 	render(templateResult, document.getElementById('lala')))
    }
}

customElements.define('single-series', Series);