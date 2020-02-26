import {Component} from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { Map, tileLayer, marker } from "leaflet";
import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";

@Component({
  selector: "app-pickup-location",
  templateUrl: "./pickup-location.page.html",
  styleUrls: ["./pickup-location.page.scss"]
})
export class PickupLocationPage {
  map: Map;
  newMarker: any;
  address: string[];
  constructor(private geocoder: NativeGeocoder, private router: Router) {}
  
  ionViewDidEnter() {
    this.loadMap();
  }
  
  loadMap() {
    this.map = new Map("mapId").setView([37.8938063, -4.7842233], 13);
    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(this.map);
  }
  
  locatePosition() {
    this.map.locate({ setView: true }).on("locationfound", (e: any) => {
      this.newMarker = marker([e.latitude, e.longitude], {
        draggable: true
      }).addTo(this.map);
      this.newMarker.bindPopup("You are located here!").openPopup();
      this.getAddress(e.latitude, e.longitude);
   
      this.newMarker.on("dragend", () => {
        const position = this.newMarker.getLatLng();
        this.getAddress(position.lat, position.lng);
       
      });
    });
  }

  locateLocal() {
    this.map.locate({ setView: true }).on("locationfound", (e: any) => {
      this.newMarker = marker([37.8938063, -4.7842233], {
        draggable: true
      }).addTo(this.map);
      this.newMarker.bindPopup("La direccion del local es esta").openPopup();
      this.getAddress(37.8938063, -4.7842233);
   
      this.newMarker.on("dragend", () => {
        const position = this.newMarker.getLatLng();
        this.getAddress(37.8938063, -4.7842233);
       
      });
    });
  }
  

  getAddress(lat: number, long: number) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.geocoder.reverseGeocode(lat, long, options).then(results => {
      this.address = Object.values(results[0]).reverse();
      
    });
  }

  confirmPickupLocation() {
    let navigationextras: NavigationExtras = {
      state: {
        pickupLocation: this.address
      }
    };
    this.router.navigate(["tabs/tab2"], navigationextras);
  }goBack() {
    this.router.navigate(["tabs/tab2"]);
  }
}