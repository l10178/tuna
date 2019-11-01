import { Component, OnInit } from '@angular/core';
import { Account } from './../shared/account/account.model';
import { ModalController } from '@ionic/angular';
import { AccountService } from '../shared/account/account.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit {
  public account: Account;
  constructor(
    private accountService: AccountService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.initAccount();
  }
  async initAccount() {
    const loginUser = await this.accountService.getLoginUser();
    if (loginUser === null) {
      this.account = new Account();
    } else {
      this.account = loginUser;
    }
  }

  save() {
    this.modalController.dismiss();
    this.accountService.saveLoginUser(this.account);
  }
}
