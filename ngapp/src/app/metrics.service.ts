import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MetricsService {

    constructor(
        private http: HttpClient
    ) { }

    getMetrics() {
        return this.http.get('/assets/code-metrics.json');
    }
}
