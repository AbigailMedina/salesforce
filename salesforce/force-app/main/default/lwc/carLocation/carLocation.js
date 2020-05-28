import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation'
import LL from '@salesforce/resourceUrl/Leaflet';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader'
import { showToast } from 'c/util'

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
                showToast('ERROR',err.body.message,'error', this)
            })
        }
    }
    disconnectedCallback(){
        unregisterAllListeners(this);
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
    get hasCar(){
        if(this.car){
            return 'slds-is-expanded';
        }
        return 'slds-is-collapsed';
    }
}