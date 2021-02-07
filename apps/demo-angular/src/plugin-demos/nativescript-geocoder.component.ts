import { Component, NgZone } from '@angular/core';
import { DemoSharedNativescriptGeocoder } from '@demo/shared';
import {} from '@fgutteridge/nativescript-geocoder';

@Component({
	selector: 'demo-nativescript-geocoder',
	templateUrl: 'nativescript-geocoder.component.html',
})
export class NativescriptGeocoderComponent {
	demoShared: DemoSharedNativescriptGeocoder;

	constructor(private _ngZone: NgZone) {}

	ngOnInit() {
		this.demoShared = new DemoSharedNativescriptGeocoder();
	}
}
