import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedNativescriptDropdown } from '@demo/shared';
import {} from '@fgutteridge/nativescript-dropdown';

export function navigatingTo(args: EventData) {
	const page = <Page>args.object;
	page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedNativescriptDropdown {}
