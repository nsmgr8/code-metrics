import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Component({
    selector: 'app-check-update',
    templateUrl: './check-update.component.html',
    styleUrls: ['./check-update.component.styl']
})
export class CheckUpdateComponent implements OnInit {
    show = false;
    original_etag;

    constructor(
        public http: HttpClient
    ) { }

    ngOnInit() {
        if (environment.production) {
            this.setUpdateRequestTimeout();
        }
    }

    requestUpdate() {
        const options: any = {
            params: {_: +(new Date())},
            observe: 'response',
            responseType: 'text'
        };

        this.http.get('/index.html', options)
            .subscribe(
                resp => this.checkUpdate(resp),
                err => {
                    if (err.status !== 304) {
                        console.log(err);
                    }
                    this.setUpdateRequestTimeout();
                }
            );
    }

    setUpdateRequestTimeout() {
        setTimeout(() => this.requestUpdate(), 60 * 1000);
    }

    checkUpdate(response) {
        const etag = response.headers.get('Etag');
        if (this.original_etag) {
            this.show = etag !== this.original_etag;
        } else {
            this.original_etag = etag;
        }
        if (!this.show) {
            this.setUpdateRequestTimeout();
        }
    }

    reload() {
        window.location.reload(true);
    }
}
