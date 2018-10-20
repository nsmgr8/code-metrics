import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileItemComponent } from './file-item/file-item.component';
import { FileDetailComponent } from './file-detail/file-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        FileItemComponent,
        FileDetailComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ScrollingModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
