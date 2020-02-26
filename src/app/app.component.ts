import { Component } from '@angular/core';

import { Globalization } from '@ionic-native/globalization/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { async } from '@angular/core/testing';
import { UiComponent } from './common/ui/ui.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {

  navigate :any;
  constructor(
    private auth:AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private global: Globalization,
    private router: Router,
    private ui:UiComponent
  ) {
    this.initializeApp();
    this.sideMenu();
  }

  initializeApp() {
    this.platform.ready().then(async() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async sideMenu(){
    await this.auth.checkSession()
    if(this.auth.isAuthenticated()){
      this.navigate =
      [
        {
          title : "Ubicación & Contacto ",
          url   : "/tabs/tab2",
          icon  : "call"
        },
        {  
          title : "Inicio",
          url   : "/tabs/tab1",
          icon  : "home"
        },
        {
          title : "Novedades",
          url   : "/tabs/tab3",
          icon  : "time"
        }
      ]
    }else{
      this.navigate =
      [
        {
          title : "Ubicación & Contacto ",
          url   : "/tabs/tab2",
          icon  : "call"
        },
        {
          title : "Inicio",
          url   : "/tabs/tab1",
          icon  : "home"
        }
      ]
    }
  }
  public logout(){
    this.auth.logout();
    this.sideMenu();
  }

  public async login(){
    this.ui.presentLoading();
    const r:boolean= await this.auth.loginGoogle();
    this.ui.hideLoading();
    if(r){
      this.sideMenu();
      
    } 
  }

  public  isAuthenticated():boolean{
    return this.auth.isAuthenticated();
  }

}
