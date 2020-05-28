import { LightningElement, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation'

import CAR_ID from '@salesforce/schema/Car__c.Id'
import CAR_NAME from '@salesforce/schema/Car__c.Name'
import CAR_MILEAGE from '@salesforce/schema/Car__c.Mileage__c'
import CAR_PER_DAY_RENT from '@salesforce/schema/Car__c.Per_Day_Rent__c'
import CAR_BULD_YEAR from '@salesforce/schema/Car__c.Build_Year__c'
import CAR_PICTURE from '@salesforce/schema/Car__c.Picture__c'
import CAR_CONTACT_NAME from '@salesforce/schema/Car__c.Contact__r.Name'
import CAR_CONTACT_EMAIL from '@salesforce/schema/Car__c.Contact__r.Email'
import CAR_CONTACT_PHONE from '@salesforce/schema/Car__c.Contact__r.HomePhone'
import CAR_CARTYPE_NAME from '@salesforce/schema/Car__c.Car_Type__r.Name'

const fields = [
 CAR_ID,
 CAR_NAME,
 CAR_MILEAGE,
 CAR_PER_DAY_RENT,
 CAR_BULD_YEAR,
 CAR_PICTURE,
 CAR_CONTACT_NAME,
 CAR_CONTACT_EMAIL,
 CAR_CONTACT_PHONE,
 CAR_CARTYPE_NAME
];

export default class CarDetails extends LightningElement {
    
    @track carId;
    @track selectedTabValue;

    @wire(getRecord, {recordId:'$carId', fields}) car;
    //$ because when carId is updated, wire will be called again
    
    @wire(CurrentPageReference) pageRef;

    connectedCallback(){
        registerListener('carselected',this.callBackForCarSelected, this)
    }
    disconnectedCallback(){
        unregisterAllListeners(this)
    }
    callBackForCarSelected(payload){
        this.carId = payload.Id;
    }

    tabChangeHandler(event){
        this.selectedTabValue = event.target.value;
    }

    handleExperienceAdded(){
        const carExperienceComp = this.template.querySelector('c-car-experiences');
        if(carExperienceComp){
            carExperienceComp.getCarExperiences();
        }
        this.selectedTabValue="viewexperiencetab"
        /*the tab value of view experience to automatically redirect 
            a user that just added an experience to this tab*/
    }

    get carSelected(){
        //because this.car is being wired, it never has a null value. 
        //its data might be null though
        if(this.car.data){
            return true;
        }return false;
    }
}