import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileItemComponent } from './file-item/file-item.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { ComplexityItemComponent } from './complexity-item/complexity-item.component';

@NgModule({
    declarations: [
        AppComponent,
        FileItemComponent,
        FileDetailComponent,
        ComplexityItemComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
        PortalModule,
        ScrollingModule,
        // AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
