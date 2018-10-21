import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TemplatePortalDirective } from '@angular/cdk/portal';

import { timer } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MetricsService } from './metrics.service';
import { ModalService } from './modal.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.styl']
})
export class AppComponent {
    _files: any = [];
    files: any = [];

    meta;

    order_by = 'mi';
    orders = [
        {key: 'cc', title: 'Complexity'},
        {key: 'mi', title: 'Maintainability'},
        {key: 'ts', title: 'Last Modified'},
        {key: 'loc', title: 'Number of lines'},
    ];
    query = '';

    qCtrl = new FormControl();

    @ViewChild('helpTpl') helpTpl: TemplatePortalDirective;

    constructor(
        private metricsService: MetricsService,
        private modalService: ModalService
    ) {
        timer(100, 5 * 60 * 1000).pipe(
            switchMap(() => this.metricsService.getMetrics())
        ).subscribe(data => this.setData(data));

        this.qCtrl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe((query: string) => {
            this.query = query;
            this.orderData();
        });
    }

    setData({meta, data}: any) {
        this.meta = meta;

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
                date: x.date * 1000,
                cc_value: cc,
                cc_rank: rank
            };
        });

        this.orderData();
    }

    orderData() {
        this.files = [...this._files.filter(x => {
            if (!this.query) {
                return true;
            }
            return x.file.includes(this.query);
        }).sort((a, b) => {
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
                    if (a.date === b.date) {
                        return b.cc_value - a.cc_value;
                    }
                    return b.date - a.date;
                default:
                    return 0;
            }

        })];
    }

    onOrder(order_by) {
        this.order_by = order_by;
        this.orderData();
    }

    showHelp() {
        this.modalService.open(this.helpTpl);
    }

    closeHelp() {
        this.modalService.close();
    }
}
