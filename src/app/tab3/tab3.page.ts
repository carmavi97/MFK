import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../model/User';
import { post } from '../model/Post';
import { PostserviceService } from '../services/postservice.service';
import { AlertController, ToastController, ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public listadoPanel;
  public post:post;
  base64Data:String;
  user:User
  converted_image:any
  constructor(private postS:PostserviceService,public loadingController: LoadingController,private router:Router,
    public alertController: AlertController,public modalController: ModalController,
     public toastController: ToastController,public authS: AuthService) {
    this.user=authS.getUser();
    this.base64Data=this.user.imageUrl;
    this.converted_image="data:image/jpeg;base64,"+this.base64Data;
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
  /*
  async presentModal(id:string,title:string,body:string) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps:{
        'title':title,
        'body':body,
        'modalController':this.modalController,
        'id':id
      }

    });
    return await modal.present()
    .then((ok)=>{
      this.refrescar();
    })
  }
*/

  
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
  this.postS.selectByUser(this.user.userId).subscribe((lista)=>{
    this.listadoPanel=lista;
    this.loadingController.dismiss();
  })
  }catch(err){
    this.loadingController.dismiss();
  }
}

public  doRefresh(event:any){
  let Myobservable=this.postS.selectByUser(this.user.userId);
  
   Myobservable.subscribe((lista)=>{  
    this.listadoPanel=[];
    this.listadoPanel=lista;
    event.target.complete();
    this.loadingController.dismiss();
  })
}
/*
  editaNota(id:string,title:string,body:string){
    this.presentModal(id,title,body);
  }
*/
  public toAdd():void{
    this.router.navigateByUrl('/add');
  }

  cancelSearch(){
    this.refrescar();
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

