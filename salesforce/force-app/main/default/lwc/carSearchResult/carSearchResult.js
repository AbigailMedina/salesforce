import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

import getCars from '@salesforce/apex/CarSearchResultController.getCars'
export default class CarSearchResult extends LightningElement {

    @api carTypeId;
    //supplied by carSearch
    @track cars;
    @track selectedCarId;

    @wire(getCars,{carTypeId:'$carTypeId'})
    wiredCars({data,error}){
        if(data){
            this.cars = data;
        }else if (error){
            this.showToast("could not fetch cars",error.body.message,"error")
        }
    }

    get carsFetched(){
        if(this.cars){
            return true;
        }return false;
    }

    showToast(title,message,variant){
        const toastEvt = new ShowToastEvent({
            title:title,
            message:message,
            variant:variant
        })
        this.dispatchEvent(toastEvt);
    }

    handleCarSelected(event){
        //carselected event from carTile.js
        const carId=event.detail;
        this.selectedCarId = carId;

    }

}