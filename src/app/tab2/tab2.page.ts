import {Router, ActivatedRoute} from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  pickupLocation: string;
   
  constructor(private router:Router,private route:ActivatedRoute) {
    this.route.queryParams.subscribe(params =>{
      if(this.router.getCurrentNavigation().extras.state){
        this.pickupLocation = this.router.getCurrentNavigation().extras.state.pickupLocation;
      }
    });
  }
  onpickupClick(){
    this.router.navigate(['pickup-location']);
  }
  
}
