import { Component, Input, ViewChild } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortalDirective } from '@angular/cdk/portal';

@Component({
    selector: 'cm-file-item',
    templateUrl: './file-item.component.html',
    styleUrls: ['./file-item.component.styl']
})
export class FileItemComponent {
    @Input() file;

    @ViewChild('complexityTemplate') complexityTemplate: TemplatePortalDirective;

    overlayRef: OverlayRef;

    constructor(
        private overlay: Overlay
    ) { }

    open() {
        const positionStrategy = this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically();

        const overlayConfig = new OverlayConfig({
            hasBackdrop: true,
            width: '90%',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy
        });

        this.overlayRef = this.overlay.create(overlayConfig);
        this.overlayRef.attach(this.complexityTemplate);
        this.overlayRef.backdropClick().subscribe(_ => this.overlayRef.dispose());
    }

    close() {
        this.overlayRef.dispose();
    }
}
