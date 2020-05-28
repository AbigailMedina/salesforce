import { LightningElement, track, wire } from 'lwc';
import { showToast } from 'c/util';
import { NavigationMixin } from 'lightning/navigation'
import getCarTypes from '@salesforce/apex/CarSearchFormController.getCarTypes'


export default class CarSearchForm extends NavigationMixin(LightningElement) {
    @track carTypes;
    @track selectedValue;

    @wire(getCarTypes) 
    wiredCarTypes({data, error}){
        if(data){
            //manipulate data from server to match what the combobox takes
            //which is a list of objects with label and value attributes
            this.carTypes=[{value:"", label:"All Types"}]//default object
            data.forEach(el => {
                const carType={}
                carType.label=el.Name;
                carType.value=el.Id;
                this.carTypes.push(carType);
            });
            this.handleCarTypeChange({detail:this.carTypes[0]})
            //dummy call to handleCarTypeChange to display all car types on start
        }else if(error){
            showToast("wire error",error.body.message,"error", this)
        }
    }

    handleCarTypeChange(event){
        const carTypeId = event.detail.value;
        const carTypeSelectionEvt = new CustomEvent('cartypeselect',{detail:carTypeId})
        this.dispatchEvent(carTypeSelectionEvt);
    }

    createNewCarType(){
        this[NavigationMixin.Navigate]({
            type:"standard__objectPage",
            attributes:{
                objectApiName: 'Car_Type__c',
                actionName: 'new'
            }
        })
    }
}