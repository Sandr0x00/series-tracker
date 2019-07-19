import {html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {Base} from './base.js';

export class HeaderComp extends Base {

    static get properties() {
        return {
            id: String,
            title: String,
            status: String
        };
    }
    constructor() {
        super();
    }

    render() {
        return html`
        <nav id="nav" class="navbar navbar-static-top container-fluid">
        <div class="col-2">
            <a id="plus" class="float-left p-4" type="button" @click=${() => document.getElementById('overlayContent').showEdit()}><i class="fas fa-2x fa-plus-circle"></i></a>
            
        </div>
        <div class="col-8">
            <input id="search" name="search" type="text" placeholder="Search" autocomplete="off" list="titelList">
        </div>
        <div class="d-none d-sm-block col-sm-1">
            <svg id="refresh" class="radial-progress" viewBox="0 0 30 30">
                <circle class="incomplete" cx="15" cy="15" r="10"></circle>
                <circle id="refresh-clock" class="complete" cx="15" cy="15" r="10"></circle>
            </svg>
        </div>
        <div class="col-2 col-sm-1">
            <a id="info" class="float-right p-4" type="button" @click=${() => document.getElementById('overlayContent').showInfo()}><i class="fas fa-2x fa-info-circle"></i></a>
        </div>
    </nav>
        `;
    }

}

customElements.define('header-comp', HeaderComp);