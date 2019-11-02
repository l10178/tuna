import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {BeanPiece} from './bean-piece.model';
import {ShakeResult} from './shake-result.model';
import {MoraEnum} from './mora.model';
import {MealEnum} from './meal.model';

@Injectable()
export class BeanPieceService {
    private readonly storage_beans_key = 'menu_beans';

    constructor(private storage: Storage) {
    }

    public async shake(): Promise<ShakeResult> {
        const result = new ShakeResult();
        result.bean = this.randomBean();
        result.mora = this.randomMora();
        return result;
    }

    public async listBeanPieces(): Promise<Array<BeanPiece>> {
        const beanPieces = await this.storage.get(this.storage_beans_key);
        if (beanPieces === null) {
            return this.listDefaultBeanPieces();
        }
        return JSON.parse(beanPieces);
    }


    public listDefaultBeanPieces(): Array<BeanPiece> {
        const defaultArray = [];
        let item = new BeanPiece();
        item.icon = 'pizza';
        item.title = '西红柿鸡蛋面';
        item.description = '西红柿鸡蛋面的制作方法相当简单方便、节省时间，因此受到上班族和妈妈们的青睐。';
        item.tags = [MealEnum[MealEnum.LUNCH], MealEnum[MealEnum.DINNER]];
        defaultArray.push(item);

        item = new BeanPiece();
        item.icon = 'pizza';
        item.title = '西安油泼面';
        item.description = '多放油，少放辣，另外加点腊汁肉、西红柿鸡蛋。';
        item.tags = [MealEnum[MealEnum.LUNCH], MealEnum[MealEnum.DINNER]];
        defaultArray.push(item);

        item = new BeanPiece();
        item.icon = 'pizza';
        item.title = '兰州拉面';
        item.description = '一清二白三红四绿五黄，中华第一面。';
        item.tags = [MealEnum[MealEnum.LUNCH], MealEnum[MealEnum.DINNER]];
        defaultArray.push(item);

        item = new BeanPiece();
        item.icon = 'pizza';
        item.title = '海鲜辛拉面';
        item.description = '今天下雨，非常适合吃一碗辛拉面，多加芥末。';
        item.tags = [MealEnum[MealEnum.LUNCH]];
        defaultArray.push(item);

        item = new BeanPiece();
        item.icon = 'pizza';
        item.title = '大骨头';
        item.description = '骨头有肉，小心塞牙缝。';
        item.tags = [MealEnum[MealEnum.LUNCH], MealEnum[MealEnum.DINNER]];
        defaultArray.push(item);

        item = new BeanPiece();
        item.icon = 'pizza';
        item.title = '酸菜小鱼';
        item.description = '酸菜鱼的主材鱼含丰富优质蛋白，人体消化吸收率可达96%，并能供给人体必需的氨基酸、矿物质、维生素A和维生素D。';
        item.tags = [MealEnum[MealEnum.DINNER]];
        defaultArray.push(item);

        return defaultArray;
    }

    private randomMora(): MoraEnum {
        return this.random(MoraEnum.Rock, MoraEnum.Scissors);
    }

    private randomBean(): BeanPiece {
        const defaultArray = this.listDefaultBeanPieces();
        return defaultArray[this.random(0, defaultArray.length - 1)];
    }

    /**
     * Returns a random integer between min (include) and max (include)
     * @param min min value
     * @param max max value
     */
    private random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
