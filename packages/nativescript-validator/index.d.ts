import { ValidatorBase } from './common';

export declare interface ValidationRule {
	property: string
	displayString?: string

	required?: boolean
	max?: number
	min?: number
	value?: any

	email?: boolean
	date?: boolean			// ISO8601
	alpha_dash?: boolean

	confirmed?: boolean
}

export default class Validator extends ValidatorBase {}
