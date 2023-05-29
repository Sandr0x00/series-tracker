import {LitElement} from 'lit';

export class BaseComp extends LitElement {
    createRenderRoot() {
        return this;
    }
}