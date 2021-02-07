import { Component } from '@angular/core';

@Component({
	selector: 'demo-home',
	templateUrl: 'home.component.html',
})
export class HomeComponent {
	demos = [
	{
		name: 'nativescript-dropdown'
	},
	{
		name: 'nativescript-geocoder'
	},
	{
		name: 'nativescript-google-maps'
	},
	{
		name: 'nativescript-validator'
	}
];
}