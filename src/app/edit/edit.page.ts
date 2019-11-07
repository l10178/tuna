import {BeanPiece} from './../shared/bean-piece.model';
import {Component, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';

import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-edit',
    templateUrl: 'edit.page.html',
    styleUrls: ['edit.page.scss']
})
export class EditPage implements OnInit {
    public beanPiece: BeanPiece;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private toastController: ToastController,
        private storage: Storage,
        public modalController: ModalController
    ) {
    }

    ngOnInit() {
        this.beanPiece = new BeanPiece();
    }


    autoSave() {
        // auto save to local
        if (this.beanPiece.title) {
            this.storage.set(this.beanPiece.title, this.beanPiece);
        }
    }

    async save() {
        this.doSuccess();
    }

    private doSuccess() {
        this.toast('Success.', 'success');
        this.router.navigate(['/list']);
    }

    async toast(message: string, color: string) {
        const toast = await this.toastController.create({
            message: message,
            position: 'top',
            color: color,
            duration: 2000
        });
        toast.present();
    }
}
