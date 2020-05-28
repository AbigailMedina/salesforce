import { LightningElement, track } from 'lwc';

export default class CarSearch extends LightningElement {

    @track carTypeId;

    handleCarTypeSelected(event){
        //from event fired from carsearchformcontroller
        this.carTypeId = event.detail;

    }
}