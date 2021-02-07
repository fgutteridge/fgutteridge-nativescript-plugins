import { Component, NgZone } from '@angular/core';
import { DemoSharedNativescriptDropdown } from '@demo/shared';
import {} from '@fgutteridge/nativescript-dropdown';

@Component({
	selector: 'demo-nativescript-dropdown',
	templateUrl: 'nativescript-dropdown.component.html',
})
export class NativescriptDropdownComponent {
	demoShared: DemoSharedNativescriptDropdown;

	constructor(private _ngZone: NgZone) {}

	ngOnInit() {
		this.demoShared = new DemoSharedNativescriptDropdown();
	}
}
