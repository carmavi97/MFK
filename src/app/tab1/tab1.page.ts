import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { analytics } from 'firebase';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { post } from '../model/Post';
import { PostserviceService } from '../services/postservice.service';
import { ModalPage } from '../modal/modal.page'
import { FormsModule,ReactiveFormsModule } from '@angular/forms'
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public listadoPanel;
  public post:post;
  constructor(private postS:PostserviceService,public loadingController: LoadingController,private router:Router,
    public alertController: AlertController,public modalController: ModalController,
     public toastController: ToastController,public authS: AuthService
     ) {
    
  }
  
  ngOnInit(){
    this.refrescar();
  }



  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando',
    });
    await loading.present();
  }

  async presentToast(msg:string,col:string,time:number=2000) {
    const toast = await this.toastController.create({
      message:  msg,
      duration: time,
      color: col
    });
    toast.present();
  }
  
  async presentModal(id:string,title:string,body:string,userId:string,imagen?:string) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps:{
        'title':title,
        'body':body,
        'modalController':this.modalController,
        'id':id,
        'userId': userId,
        'image': imagen
      }

    });
    return await modal.present()
    .then((ok)=>{
      this.refrescar();
    })
  }


  
  async presentConfirm(id:string) {
    const alert = await this.alertController.create({
      header: 'BORRAR',
      message: '¿Desea borrar este mensaje?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancelar',
        handler: () => {
          console.log('cancelar');
        }
      },
      {
        text: 'Aceptar',
        handler: () => {
          this.borraNota(id);
        }
      }]
    });
    await  alert.present();
  }


public async doBorrar(id:string){
  await this.presentConfirm(id);
}

  public async borraNota(id:string){
    this.postS.removePost(id).then((salida)=>{
      console.log(salida);
      this.refrescar()
    }).then((ok)=>{
      this.presentToast('Nota borrada','dark')
    })
    .catch((err)=>{
      //this.vibration.vibrate(1000);
      this.presentToast('Error','danger');
    });
  }
 
private async refrescar(){
  await this.presentLoading();
  try{
  this.postS.readPost2().subscribe((lista)=>{
    this.listadoPanel=lista;
    this.loadingController.dismiss();
  })
  }catch(err){
    this.loadingController.dismiss();
  }
}

public  doRefresh(event:any){
  let Myobservable=this.postS.readPost2();
  
   Myobservable.subscribe((lista)=>{
    for(let item of lista){
      item.imagen="data:image/jpeg;base64,"+item.imagen;
    }
    this.listadoPanel=[];
    this.listadoPanel=lista;
    
    event.target.complete();
    
    this.loadingController.dismiss();
  })
}

  aboutPost(id:string,title:string,body:string,userId:string,imagen:string){
    this.presentModal(id,title,body,userId,imagen);
  }

  public toAdd():void{
    this.router.navigateByUrl('/add');
  }

  cancelSearch(){
    this.refrescar();
  }

  isAuthenticated():boolean{
    return this.authS.isAuthenticated();
  }

  getItems(ev: any) {

    // // set toSearch to the value of the searchbar
    // var toSearch = searchbar.srcElement.value;
    let toSearch = ev.target.value;


    this.listadoPanel = this.listadoPanel.filter((info) => {
      if(info.title && toSearch) {
        if (info.title.toLowerCase().indexOf(toSearch.toLowerCase()) > -1){
          return true;
        }
        return false;
      }
    });

  }
}
