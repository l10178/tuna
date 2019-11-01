import { AccountService } from './../shared/account/account.service';
import { BeanPiece } from './../shared/bean-piece.model';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';

import { Router, ActivatedRoute } from '@angular/router';

import {
  GITHUB_USER,
  GITHUB_MARKDOWN_REPO,
  GITHUB_MARKDOWN_REPO_DEFAULT_BR
} from './../constants';
import GitHub from 'github-api';
import { LoginPage } from '../login/login.page';

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
    private accountService: AccountService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.initContent();
    // check use login, if not, show login dialog
    this.checkLogin();
  }

  private initContent() {
    this.beanPiece = new BeanPiece();
    this.route.params.subscribe(params => {
      let fileId = params.id;
      if (fileId) {
        // TODO: redo
        this.beanPiece.title = fileId;
        let github = new GitHub();
        let repo = github.getRepo(GITHUB_USER, GITHUB_MARKDOWN_REPO);
        repo
          .getContents(GITHUB_MARKDOWN_REPO_DEFAULT_BR, fileId, true)
          .then(response => {
            this.beanPiece.description = response.data;
          });
      }
    });
  }

  async checkLogin() {
    const loginUser = await this.accountService.getLoginUser();
    if (loginUser === null) {
      // show login dialog
      this.showLoginModal();
    }
  }

  async showLoginModal() {
    const modal = await this.modalController.create({
      component: LoginPage
    });
    return await modal.present();
  }

  autoSave() {
    // auto save to local
    if (this.beanPiece.title) {
      this.storage.set(this.beanPiece.title, this.beanPiece);
    }
  }

  async save() {
    const loginUser = await this.accountService.getLoginUser();
    if (loginUser === null) {
      // show login dialog
      this.showLoginModal();
    }

    let github = new GitHub(loginUser);
    let repo = github.getRepo(GITHUB_USER, GITHUB_MARKDOWN_REPO);
    const result = repo.writeFile(
      GITHUB_MARKDOWN_REPO_DEFAULT_BR,
      this.beanPiece.title + '.md',
      this.beanPiece.description,
      'auto push by my app.',
      {
        encode: true
      }
    );
    result
      .then(data => {
        this.doSuccess(data);
      })
      .catch(error => {
        this.doError(error);
      });
  }
  private doError(error: any) {
    this.toast(error.message, 'danger');
    if (error.response.status === 401) {
      this.showLoginModal();
    }
  }

  private doSuccess(data: any) {
    this.toast(data.statusText, 'success');
    this.storage.remove(this.beanPiece.title);
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
