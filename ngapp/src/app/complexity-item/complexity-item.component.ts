import { Component, Input } from '@angular/core';

@Component({
    selector: 'cm-complexity-item',
    templateUrl: './complexity-item.component.html',
    styleUrls: ['./complexity-item.component.styl']
})
export class ComplexityItemComponent {
    @Input() item;
    @Input() even;

    constructor() { }

}
