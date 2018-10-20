import { Component } from '@angular/core';

import { MetricsService } from './metrics.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.styl']
})
export class AppComponent {
    _files: any = [];
    files: any = [];

    order_by = 'cc';
    orders = [
        {key: 'cc', title: 'Complexity'},
        {key: 'mi', title: 'Maintainability'},
        // {key: 'ts', title: 'Last Modified'},
        {key: 'loc', title: 'Number of lines'},
    ];

    constructor(
        private metricsService: MetricsService
    ) {
        this.metricsService.getMetrics().subscribe(
            data => this.setData(data)
        );
    }

    setData(data) {
        this._files = data.map(x => {
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
        });
        this.orderData();
    }

    orderData() {
        this.files = [...this._files.sort((a, b) => {
            switch (this.order_by) {
                case 'cc':
                    if (a.cc_value === b.cc_value) {
                        return a.mi - b.mi;
                    }
                    return b.cc_value - a.cc_value;
                case 'mi':
                    if (a.mi === b.mi) {
                        return b.cc_value - a.cc_value;
                    }
                    return a.mi - b.mi;
                case 'loc':
                    if (a.loc === b.loc) {
                        return b.cc_value - a.cc_value;
                    }
                    return b.loc - a.loc;
                case 'ts':
                default:
                    return 0;
            }

        })];
    }

    onOrder(order_by) {
        this.order_by = order_by;
        this.orderData();
    }
}
