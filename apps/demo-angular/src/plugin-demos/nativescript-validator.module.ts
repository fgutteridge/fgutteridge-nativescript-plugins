import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { NativescriptValidatorComponent } from './nativescript-validator.component';

@NgModule({
	imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: NativescriptValidatorComponent }])],
	declarations: [NativescriptValidatorComponent],
	schemas: [NO_ERRORS_SCHEMA],
})
export class NativescriptValidatorModule {}
