import { Component } from '@angular/core';

import { MetricsService } from './metrics.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.styl']
})
export class AppComponent {
    files: any = [];

    constructor(
        private metricsService: MetricsService
    ) {
        this.metricsService.getMetrics().subscribe(
            data => this.files = data
        );
    }
}
