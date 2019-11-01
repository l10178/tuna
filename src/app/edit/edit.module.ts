import {LoginPageModule} from './../login/login.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgxMdModule} from 'ngx-md';
import {EditPage} from './edit.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NgxMdModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                component: EditPage
            }
        ]),
        LoginPageModule,
    ],
    declarations: [EditPage]
})
export class EditPageModule {
}
