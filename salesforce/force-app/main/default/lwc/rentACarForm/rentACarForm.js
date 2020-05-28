import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation'
import { showToast } from 'c/util';

import getDatesAvailable from '@salesforce/apex/RentCar.getDatesAvailable';
import rentThisCar from '@salesforce/apex/RentCar.rentThisCar';

export default class RentACarForm extends LightningElement {
    @track daysAvailable;
    @track startDate;
    @track endDate;
    @track carId;
    @wire(CurrentPageReference) pageRef;
    
    connectedCallback(){
        registerListener('carselected',this.callBackForCarSelected, this);
    }
    disconnectedCallback(){
        unregisterAllListeners(this);
    }
    
    callBackForCarSelected(payload){
        this.carId = payload.Id;
        this.getDatesAvailable();
    }
    
    getDatesAvailable(){
        getDatesAvailable({carId : this.carId
        }).then( res => {
            console.log('res: ',res);
            this.daysAvailable = res.map((date)=>{
                return {label: date, value: date}
            });
        }).catch(error => {
            showToast('Error',error.message.body,'error', this)
            console.log('error')
        });  
    }

    findDatesAvail(){
        this.getDatesAvailable();
    }

    rentCar(){
        if(this.carId && this.startDate && this.endDate){
            
            const start = new Date(this.startDate);
            const end = new Date(this.endDate);

            rentThisCar({
                carId : this.carId,
                startDate : start,
                endDate : end
            }).then(res=>{
                console.log('car rented',res)
            }).catch( err =>{
                console.log(err.body.message)
            });
            
        }
    }
    get carSelected(){
        //because this.car is being wired, it never has a null value. 
        //its data might be null though
        if(this.carId){
            return true;
        }return false;
    }

    get options() {
        return this.daysAvailable;
    }

    handleStartDateChange(event) {
        this.startDate = event.detail.value;
        console.log("start date changed to: ",event.detail.value)
    }
    handleEndDateChange(event) {
        this.endDate = event.detail.value;
        console.log("end date changed to: ",event.detail.value)
    }
}