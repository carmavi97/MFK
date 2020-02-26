import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { post } from '../model/Post';
import { LoadingController, ToastController } from '@ionic/angular';
import {Router} from '@angular/router';
import { PostserviceService } from '../services/postservice.service';
import { AuthService } from '../services/auth.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss']
})
export class AddPage implements OnInit {
  public postForm:FormGroup;
  image:any='';
  converted_image:string;
  constructor(private formBuilder:FormBuilder,
     private postS:PostserviceService,
     private auth:AuthService,
     public loadingController: LoadingController,
     public toastController: ToastController,
     private router:Router,
     private camera:Camera) {
    
  }
  public toList(){
    this.router.navigateByUrl('/tabs/tab1');
  }

  ngOnInit(){
    this.postForm=this.formBuilder.group({
      title:['',Validators.required],
      body:[''],
      img:['']
    });
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

  addPost(){
    let data:post;
    data={
      title:this.postForm.get('title').value,
      body:this.postForm.get('body').value,
      imagen:this.converted_image,
      creatorId: this.auth.getUser().userId
    }
    this.presentLoading();
    this.postS.addPost(data)
    .then((ok)=>{
      this.postForm.reset();
      this.presentToast('Post agregado','dark')
    })
    .catch((err)=>{
      this.presentToast('Error','danger')
    })
    .finally(()=>{
      this.loadingController.dismiss();
      this.router.navigateByUrl('/tabs/tab1');
    })
  }

  openCam(){

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     //alert(imageData)
     this.image=(<any>window).Ionic.WebView.convertFileSrc(imageData);
     this.converted_image= "data:image/jpeg;base64,"+this.image;
    }, (err) => {
     // Handle error
     alert("error "+JSON.stringify(err))
    });

  }

}