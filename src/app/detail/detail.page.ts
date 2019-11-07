import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-detail',
    templateUrl: 'detail.page.html',
    styleUrls: ['detail.page.scss']
})
export class DetailPage implements OnInit {
    public path: string;
    public id: string;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
    }
}
