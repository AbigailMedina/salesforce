import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { showToast } from 'c/util';
import { CurrentPageReference } from 'lightning/navigation'
import START_FIELD from '@salesforce/schema/Car_Reservation__c.Reservation_Start__c';
import END_FIELD from '@salesforce/schema/Car_Reservation__c.Reservation_End__c';

    

export default class ReservationRecordForm extends LightningElement {
    fields = [START_FIELD, END_FIELD];
    objectApiName="Car_Reservation__c"
    @track title
    @track selectedCar;
    @wire(CurrentPageReference) pageRef;

    handleSuccess(){
        
        showToast('Successful reservation complete', 'Record'+event.detail.id, 'success', this)
    }
    handleSubmit(event){
        event.preventDefault();       // stop the form from submitting
        const fields = event.detail.fields;
        fields.Car__c = this.selectedCar.Id; // modify a field
        this.template.querySelector('lightning-record-form').submit(fields);
     }
    connectedCallback(){
        registerListener('carselected',this.callBackForCarSelected, this)
    }
    disconnectedCallback(){
        unregisterAllListeners(this)
    }
    callBackForCarSelected(payload){
        this.selectedCar = payload;
        // this.title = "Reserve "+String.toString(payload.Name);
        this.title = "Reserve "+payload.Name;
    }

    get hasCar(){
        if(this.selectedCar){
            return 'slds-is-expanded';
        }
        return 'slds-is-collapsed';
    }
}