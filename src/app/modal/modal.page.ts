import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, LoadingController, ToastController } from '@ionic/angular';

import { post } from '../model/post';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() title: string;
  @Input() body: string;
  @Input() modalController: ModalController;
  @Input() id: string;
  @Input() idUsuario: String;
  @Input() imagen:string;
  constructor(public loadingController: LoadingController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando',
    });
    await loading.present();
  }

  toList(){
    this.dismiss();
  }
}
