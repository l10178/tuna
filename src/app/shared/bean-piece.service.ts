import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {BeanPiece} from './bean-piece.model';
import {ShakeResult} from "./shake-result.model";
import {MoraEnum} from "./mora.model";

@Injectable()
export class BeanPieceService {
    private readonly storage_beans_key = 'menu_beans';

    constructor(private storage: Storage) {
    }


    public async shake(): Promise<ShakeResult> {
        let result = new ShakeResult();
        result.bean = this.randomBean();
        result.mora = this.randomMora();
        return result;
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
        item.icon = 'beer';
        item.title = 'xihongshi';
        item.description = 'test';
        item.tags = ['早餐', '午餐', '晚餐'];
        return [item];
    }

    private randomMora(): MoraEnum {
        return this.random(MoraEnum.Rock, MoraEnum.Scissors);
    }

    /**
     * Returns a random integer between min (include) and max (include)
     * @param min min value
     * @param max max value
     */
    private random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private randomBean(): BeanPiece {
        const item = new BeanPiece();
        item.icon = 'beer';
        item.title = 'xihongshi';
        item.description = 'test';
        item.tags = ['早餐', '午餐', '晚餐'];
        return item;
    }
}
