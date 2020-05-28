import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation'
import LL from '@salesforce/resourceUrl/Leaflet';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class CarLocation extends LightningElement {
    @track car;
    @wire(CurrentPageReference) pageRef;
    leafletLoaded;
    leafletMap;

    connectedCallback(){
        registerListener('carselected', this.callBackForCarSelected, this)
    }
    renderedCallback(){
        if (!this.leafletLoaded){
            Promise.all([
                loadStyle(this, LL+'/leaflet.css'),
                loadScript(this,LL+'/leaflet-src.js')
            ]).then(()=>{
                this.leafletLoaded = true
            }).catch((err)=>{
                this.showToast('ERROR',err.body.message,'error')
            })
        }
    }
    disconnectedCallback(){
        unregisterAllListeners(this);
    }
    showToast(title, message, variant){
        const errToast = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        })
        this.dispatchEvent(errToast);
    }
    callBackForCarSelected(payload){
        this.car = payload
        if(this.leafletLoaded){
            if(!this.leafletMap){
                const map = this.template.querySelector('.map')
                if (map) {
                    this.leafletMap = L.map( map, {zoomControl : true}).setView([42.356045,-71.085650], 13);
                    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',{attribution:'Tiles For Rent A Car'}).addTo(this.leafletMap)
                } 
            }
            if(this.car){
                const location = [this.car.Geolocation__Latitude__s, this.car.Geolocation__Longitude__s]
                const leafletMarker = L.marker(location)
                leafletMarker.addTo(this.leafletMap);
                this.leafletMap.setView(location);
            }
            
        }
    }
    get carSelected(){
        //because this.car is being wired, it never has a null value. 
        //its data might be null though
        if(this.car){
            return true;
            //could use slds-is-expanded or collapsed as class
        }return false;
    }
}