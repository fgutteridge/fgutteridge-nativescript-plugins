import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

import { HomeComponent } from './home.component';

const routes: Routes = [
   { path: '', redirectTo: '/home', pathMatch: 'full' },
   { path: 'home', component: HomeComponent },
	{ path: 'nativescript-dropdown', loadChildren: () => import('./plugin-demos/nativescript-dropdown.module').then(m => m.NativescriptDropdownModule) },
	{ path: 'nativescript-geocoder', loadChildren: () => import('./plugin-demos/nativescript-geocoder.module').then(m => m.NativescriptGeocoderModule) },
	{ path: 'nativescript-google-maps', loadChildren: () => import('./plugin-demos/nativescript-google-maps.module').then(m => m.NativescriptGoogleMapsModule) },
	{ path: 'nativescript-validator', loadChildren: () => import('./plugin-demos/nativescript-validator.module').then(m => m.NativescriptValidatorModule) }
];

@NgModule({
	imports: [NativeScriptRouterModule.forRoot(routes)],
	exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
