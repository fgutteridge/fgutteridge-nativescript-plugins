import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { NativescriptDropdownComponent } from './nativescript-dropdown.component';

@NgModule({
	imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: NativescriptDropdownComponent }])],
	declarations: [NativescriptDropdownComponent],
	schemas: [NO_ERRORS_SCHEMA],
})
export class NativescriptDropdownModule {}
