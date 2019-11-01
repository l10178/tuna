import { Account } from './account.model';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SecurityService } from '../security/security.service';

@Injectable()
export class AccountService {
  private readonly storage_account_key = 'account_gt_login';
  constructor(
    private storage: Storage,
    private securityService: SecurityService
  ) {}

  public async getLoginUser(): Promise<Account> {
    const loginUser = await this.storage.get(this.storage_account_key);
    return <Account>this.securityService.decrypt(loginUser);
  }

  public saveLoginUser(user: Account): void {
    const encryptedUser = this.securityService.encrypt(user);
    this.storage.set(this.storage_account_key, encryptedUser);
  }
}
