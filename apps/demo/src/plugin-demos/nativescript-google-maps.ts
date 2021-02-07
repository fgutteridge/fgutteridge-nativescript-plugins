import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedNativescriptGoogleMaps } from '@demo/shared';
import {} from '@fgutteridge/nativescript-google-maps';

export function navigatingTo(args: EventData) {
	const page = <Page>args.object;
	page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedNativescriptGoogleMaps {}
