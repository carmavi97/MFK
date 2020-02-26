import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user:User;

  constructor(private local: NativeStorage,private google: GooglePlus,private router : Router) { }

public async checkSession():Promise<void>{
  if(!this.user){
    try{
      this.user=await this.local.getItem('user'); 
      await this.local.getItem('user');
    }catch(err){
      this.user=null;
    }
  }
}

  isAuthenticated():boolean{
    return this.user?true:false;
  }

  loginGoogle():Promise<boolean>{
      return new Promise((resolve,reject)=>{
        //logica 
        this.google.login({})
        .then(d=>{
          if(d&&d.email){
              let user:User={
                email:d.email,
                name:d.dispalyName,
                imageUrl:d.imageUrl,
                userId:d.userId
              }
              this.user=user;
              this.saveSession(user);
              resolve(true);
              this.router.navigate(['tabs']);
            }else{
              resolve(false);
            }
          }
        )
        .catch(err=>{resolve(false)})
      })
  }

  public async saveSession(user?:User){
    if(user){
      await  this.local.setItem('user',user);
    }else{
      this.local.remove('user');
    }
  }

  public async logout(){
    await this.google.logout();
    this.user=null;
    await this.saveSession;
  }

  public getUser():User{
    return this.user;
  }
}

