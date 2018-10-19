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
            data => this.setData(data)
        );
    }

    setData(data) {
        this.files = data.map(x => {
            let cc = 0, rank = '';
            try {
                x.cc.forEach(y => {
                    if (y.complexity > cc) {
                        cc = y.complexity;
                        rank = y.rank;
                    }
                });
            } catch (e) {
            }

            return {
                ...x,
                cc_value: cc,
                cc_rank: rank
            };
        }).sort((a, b) => {
            if (a.cc_value === b.cc_value) {
                return a.mi - b.mi;
            }
            return b.cc_value - a.cc_value;
        });
    }
}
