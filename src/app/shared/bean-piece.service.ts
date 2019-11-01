import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {BeanPiece} from './bean-piece.model';

@Injectable()
export class BeanPieceService {
    private readonly storage_beans_key = 'menu_beans';

    constructor(private storage: Storage) {
    }


    public async listBeanPieces(): Promise<Array<BeanPiece>> {
        const beanPieces = await this.storage.get(this.storage_beans_key);
        if (beanPieces === null) {
            return this.initData();
        }
        return JSON.parse(beanPieces);
    }

    private initData() {
        const item = new BeanPiece();
        item.title = 'xihongshi';
        item.description = 'test';
        return [item];
    }
}
