import {Component, OnInit} from '@angular/core';
import {BeanPieceService} from '../shared/bean-piece.service';
import {ShakeResult} from '../shared/shake-result.model';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    public shakeResult: ShakeResult;

    constructor(private beanPieceService: BeanPieceService) {
    }


    ngOnInit() {
        this.shakeResult = new ShakeResult();
    }

    async shake() {
        this.shakeResult = await this.beanPieceService.shake();
    }
}
