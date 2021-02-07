import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { NativescriptGeocoderComponent } from './nativescript-geocoder.component';

@NgModule({
	imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: NativescriptGeocoderComponent }])],
	declarations: [NativescriptGeocoderComponent],
	schemas: [NO_ERRORS_SCHEMA],
})
export class NativescriptGeocoderModule {}
