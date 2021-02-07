import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedNativescriptValidator } from '@demo/shared';
import {} from '@fgutteridge/nativescript-validator';

export function navigatingTo(args: EventData) {
	const page = <Page>args.object;
	page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedNativescriptValidator {}
