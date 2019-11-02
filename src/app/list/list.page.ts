import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll} from '@ionic/angular';
import {BeanPiece} from '../shared/bean-piece.model';
import {BeanPieceService} from '../shared/bean-piece.service';

@Component({
    selector: 'app-list',
    templateUrl: 'list.page.html',
    styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
    public items: Array<BeanPiece> = [];

    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    constructor(private beanPieceService: BeanPieceService) {
    }

    ngOnInit() {
        this.initData();
    }

    private initData() {
        this.beanPieceService.listBeanPieces()
            .then(es => {
                this.items = es;
            });
    }

    loadData(event) {
        setTimeout(() => {
            event.target.complete();
        }, 500);
    }

}
