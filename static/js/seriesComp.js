import {html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {Base} from './base.js';

class Series extends Base {

    static get properties() {
        return {
            data: Array,
            id: String,
            title: String,
            status: String
        };
    }

    constructor() {
        super();
        document.getElementById('overlayContent').showError('Loading');
        this.data = [];
        this.loadStuff();
    }

    render() {
        let draw = html`
        ${this.data.map(i => html`${i}`)}`;
        return draw;
    }

    updated(changedProperties) {
        if (changedProperties.has('data')) {
            $('.placeholder').each(function() {
                if (!$(this).data('large')) {
                    return;
                }
                let bgImg = new Image();
                bgImg.onload = () => {
                    $(this).css('background-image', 'url(' + bgImg.src + ')');
                    // $(this).removeClass('blur');
                };
                bgImg.onerror = () => {
                    $(this).css('background-image', 'url(/img/unknown.jpg)');
                    // $(this).removeData('large');
                    // $(this).data('large', '/img/unknown.jpg');
                };
                bgImg.src = $(this).data('large');
            });
            $('[data-toggle="tooltip"]').tooltip({
                placement: 'top',
                container: 'body',
                offset: '0, -100%',
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
            });
        }
    }

    single({ Id, Title, Status }) {
        return html`
<div id="${Id}_div" class="seriesDiv col-xs-6 col-sm-3 col-md-2 col-lg-2 col-xl-1">
<a class="series placeholder display ${Status.match('^(SxxE|Exxx)xx$') ? 'grayscale' : ''}" id="${Id}" @click=${() => document.getElementById('overlayContent').showEdit(Id, Title, Status, `/img/${Id}.jpg`)} data-toggle="tooltip" data-original-title="${Title}" data-large="/img/${Id}.jpg">
    <span class="shadow" id="${Id}_status">${Status}</span>
</a>
</div>`;
    }

    loadStuff() {
        fetch('/api/seriesa')
            .then(response => response.json())
            .then(series => {
                return series.map(this.single);
            })
            .then(data => {
                document.getElementById('overlayContent').close();
                this.data = data;
            }).catch(err => {
                document.getElementById('overlayContent').showError(err);
            });
    }
}

customElements.define('all-series', Series);