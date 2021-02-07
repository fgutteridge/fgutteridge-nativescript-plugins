import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedNativescriptGeocoder } from '@demo/shared';
import {} from '@fgutteridge/nativescript-geocoder';

export function navigatingTo(args: EventData) {
	const page = <Page>args.object;
	page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedNativescriptGeocoder {}
