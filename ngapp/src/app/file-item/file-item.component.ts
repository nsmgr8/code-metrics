import { Component, Input, ViewChild } from '@angular/core';
import { TemplatePortalDirective } from '@angular/cdk/portal';

import { ModalService } from '../modal.service';

@Component({
    selector: 'cm-file-item',
    templateUrl: './file-item.component.html',
    styleUrls: ['./file-item.component.styl']
})
export class FileItemComponent {
    @Input() file;
    @Input() even;

    @ViewChild('complexityTemplate') complexityTemplate: TemplatePortalDirective;

    constructor(
        private modalService: ModalService
    ) { }

    open() {
        this.modalService.open(this.complexityTemplate);
    }

    close() {
        this.modalService.close();
    }
}
