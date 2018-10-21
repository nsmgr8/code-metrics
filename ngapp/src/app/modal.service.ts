import { Injectable } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    overlayRef: OverlayRef;

    constructor(
        private overlay: Overlay
    ) { }

    open(tpl) {
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
        this.overlayRef.attach(tpl);
        this.overlayRef.backdropClick().subscribe(_ => this.overlayRef.dispose());
    }

    close() {
        this.overlayRef.dispose();
    }
}
