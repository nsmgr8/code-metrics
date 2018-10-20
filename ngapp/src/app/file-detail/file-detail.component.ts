import { Component, Input } from '@angular/core';

@Component({
    selector: 'cm-file-detail',
    templateUrl: './file-detail.component.html',
    styleUrls: ['./file-detail.component.styl']
})
export class FileDetailComponent {
    @Input() set complexity(data) {
        this.data = data.map(x => {
            return {
                ...x,
                line_count: x.endline - x.lineno + 1
            };
        }).sort((a, b) => b.complexity - a.complexity);
    }

    data = [];

    constructor() { }

}
