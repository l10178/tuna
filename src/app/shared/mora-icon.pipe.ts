import {Pipe, PipeTransform} from '@angular/core';
import {MoraEnum} from './mora.model';

@Pipe({
    name: 'moraicon'
})

export class MoraIconPipe implements PipeTransform {
    transform(value: MoraEnum): string {
        if (MoraEnum.Rock === value) {
            return 'hammer';
        }
        if (MoraEnum.Paper === value) {
            return 'hand';
        }
        return 'cut';
    }
}
