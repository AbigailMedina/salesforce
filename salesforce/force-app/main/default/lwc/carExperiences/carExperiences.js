import { LightningElement, track, api } from 'lwc';
import { showToast } from 'c/util';
import { NavigationMixin } from 'lightning/navigation'
import getExperiences from '@salesforce/apex/CarExperience.getExperiences'

export default class CarExperiences extends NavigationMixin(LightningElement) {

    @track carExperiences=[];
    privateCarId;

    connectedCallback(){
        this.getCarExperiences();
    }
    
    @api
    get carId(){
        return this.privateCarId
    }
    set carId(value){
        this.privateCarId = value;
        this.getCarExperiences()
    }
    get hasExperiences(){
        if (this.carExperiences && this.carExperiences.length > 0){
            return true;
        }return false;
    }
    @api
    getCarExperiences(){
        //made this @api to make it public and therefore accesible to the parent component, carDetails
        getExperiences({carId:this.privateCarId}).then( res => {
            this.carExperiences = res;
            console.log(res);
        }).catch(error => {
            showToast('Error',error.message.body,'error', this)
        })
    }

    userClickHandler(event){
        //navigate to event.target.value user record
        const userId= event.target.getAttribute('data--userid')
        this[NavigationMixin.Navigate]({
            type:"standard__recordPage",
            attributes:{
                "recordId": this.userId,
                objectApiName: "User",
                actionName: "view"
            }
        })
    }
}