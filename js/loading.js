import {html} from 'lit-element';
import {BaseComp} from './base.js';

export class DialogErrorComp extends BaseComp {

    static get properties() {
        return {
            loading: Boolean,
        };
    }

    constructor() {
        super();
        this.loading = true;
    }

    open() {
        this.loading = true;
    }
    close() {
        this.loading = false;
    }

    render() {
        if (!this.loading) {
            return html``;
        } else {
            return html`
<div class="bg-load"></div>
<div class="col text-center loading">
  <i class="fas fa-yin-yang fa-spin fa-5x"></i>
</div>`;
        }
    }
}

customElements.define('loading-dialog', DialogErrorComp);