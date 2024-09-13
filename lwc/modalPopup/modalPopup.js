import { LightningElement,api } from 'lwc';

export default class ModalPopup extends LightningElement {

    @api isOpen = false;
    @api content; 

    closeModal(){
        this.isOpen = false;
        const closeEvent = new CustomEvent('close');
        this.dispatchEvent(closeEvent);
    }
}