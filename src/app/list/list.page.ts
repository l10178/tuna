import {BeanPiece} from '../shared/bean-piece.model';
import {Component, OnInit} from '@angular/core';
import {BeanPieceService} from '../shared/bean-piece.service';

@Component({
    selector: 'app-list',
    templateUrl: 'list.page.html',
    styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
    private icons = [
        'flask',
        'wifi',
        'beer',
        'football',
        'basketball',
        'paper-plane',
        'american-football',
        'boat',
        'bluetooth',
        'build'
    ];
    public items: Array<BeanPiece> = [];

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

    doRefresh(event: any) {
        this.initData();
    }
}
