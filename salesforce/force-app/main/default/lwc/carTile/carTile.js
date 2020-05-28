import { LightningElement, api, wire } from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class CarTile extends LightningElement {

    @api car;
    @api selectedCarId;
    //accepting this from carSearchResult because 
    //ALL car tiles should know which tile is currently selected

    @wire(CurrentPageReference)pageRef;

    handleCarSelect(event){
        event.preventDefault();
        const carId = this.car.Id;
        const carSelect = new CustomEvent('carselected',{detail:carId});
        const eventRet = this.dispatchEvent(carSelect);
        fireEvent(this.pageRef, 'carselected', this.car);
        return eventRet
    }

    get isCarSelected(){
        if (this.car.Id === this.selectedCarId){
            return 'tile selected'
        }
        else 'tile'
    }
}