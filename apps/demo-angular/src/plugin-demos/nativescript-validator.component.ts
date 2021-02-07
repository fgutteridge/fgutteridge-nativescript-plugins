import { Component, NgZone } from '@angular/core';
import { DemoSharedNativescriptValidator } from '@demo/shared';
import {} from '@fgutteridge/nativescript-validator';

@Component({
	selector: 'demo-nativescript-validator',
	templateUrl: 'nativescript-validator.component.html',
})
export class NativescriptValidatorComponent {
	demoShared: DemoSharedNativescriptValidator;

	constructor(private _ngZone: NgZone) {}

	ngOnInit() {
		this.demoShared = new DemoSharedNativescriptValidator();
	}
}
