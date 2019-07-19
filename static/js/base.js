import {LitElement} from 'https://unpkg.com/lit-element/lit-element.js?module';

export class Base extends LitElement {
    createRenderRoot() {
        return this;
    }
}