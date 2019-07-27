import {LitElement} from 'https://unpkg.com/lit-element/lit-element.js?module';

export class BaseComp extends LitElement {
    createRenderRoot() {
        return this;
    }
}