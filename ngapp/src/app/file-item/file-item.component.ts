import { Component, Input } from '@angular/core';

@Component({
    selector: 'cm-file-item',
    templateUrl: './file-item.component.html',
    styleUrls: ['./file-item.component.styl']
})
export class FileItemComponent {
    @Input() file;

    constructor() { }

}
