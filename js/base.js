import {LitElement} from 'lit-element';

export class BaseComp extends LitElement {
    createRenderRoot() {
        return this;
    }
}