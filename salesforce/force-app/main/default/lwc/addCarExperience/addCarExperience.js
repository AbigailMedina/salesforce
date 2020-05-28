import { LightningElement, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import NAME_FIELD from '@salesforce/schema/Car_Experience__c.Name'
import EXPERIENCE_FIELD from '@salesforce/schema/Car_Experience__c.Experience__c'
import CAR_FIELD from '@salesforce/schema/Car_Experience__c.Car__c'
import EXPERIENCE_OBJECT from '@salesforce/schema/Car_Experience__c'

export default class AddCarExperience extends LightningElement {

    expTitle;
    expDescription;
    @api carId

    handleTitleChange(event){
        this.expTitle=event.target.value
    }
    handleDescChange(event){
        this.expDescription=event.target.value
    }
    addExperience(){
        const fields={}
        fields[NAME_FIELD.fieldApiName] = this.expTitle;
        fields[EXPERIENCE_FIELD.fieldApiName] = this.expDescription;
        fields[CAR_FIELD.fieldApiName] = this.carId;
        const recordInput = {apiName: EXPERIENCE_OBJECT.objectApiName, fields}
        createRecord(recordInput).then(res => {
            this.showToast('Success', "experience added", "success")
            const addExpEvent = new CustomEvent('experienceadded')
            const eventSent = this.dispatchEvent(addExpEvent);
            this.expTitle = ''
            this.expDescription=''
        }).catch(err=>{
            this.showToast('Error adding experience', err.body.message,'error')
        })
    }
    showToast(title, message, variant){
        const errToast = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        })
        this.dispatchEvent(errToast);
    }
}