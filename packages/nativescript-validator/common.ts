import { ValidationRule } from '.'

const ValidationRegExpPatterns = {
	date: /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/ as RegExp,
	email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ as RegExp,
	alpha_dash: /^[\w-]*$/ as RegExp
}

export class ValidatorBase {
	public validate(model: Object, rules: ValidationRule[]): string[] | true {
		let errors: string[] = []

		for (const rule of rules) {
			// If no valid combination of validation rules are set, skip the rule
			if (!rule.required && !rule.max && !rule.min && rule.value === undefined)
				continue

			// Check if the property exists on the model
			let propertyExists = model.hasOwnProperty(rule.property) && ((typeof model[rule.property] !== 'boolean' && typeof model[rule.property] !== 'number') ? model[rule.property] as boolean : true)
			const propertyValue = propertyExists ? model[rule.property] : null

			// Trim whitespace from the property value (if it's a string)
			if (propertyExists && typeof propertyValue === 'string')
				propertyExists = propertyValue.trim().length > 0

			const displayString = rule.displayString || rule.property

			// "Required" validation
			if (rule.required && !propertyExists) {
				errors.push(`The ${displayString} field is required.`)
				continue
			}

			// Minimum value validation
			if (rule.min && propertyExists) {
				if (typeof propertyValue === 'string' && propertyValue.length < rule.min)
					errors.push(`The ${displayString} field must contain a minimum of ${rule.min} characters.`)
				else if (typeof propertyValue === 'number' && propertyValue < rule.min)
					errors.push(`The ${displayString} field must be a minimum of ${rule.min}.`)
			}

			// Maximum value validation
			if (rule.max && propertyExists) {
				if (typeof propertyValue === 'string' && propertyValue.length > rule.max)
					errors.push(`The ${displayString} field must contain fewer than ${rule.max} characters.`)
				else if (typeof propertyValue === 'number' && propertyValue > rule.max)
					errors.push(`The ${displayString} field must be less than ${rule.max}.`)
			}

			// Value validation
			if (rule.value !== undefined && propertyExists && propertyValue !== rule.value) {
				if (typeof propertyValue === 'boolean' && rule.value === true)
					errors.push(`The ${displayString} field must be checked.`)
				else if (typeof propertyValue === 'string')
					errors.push(`The ${displayString} field must be equal to "${rule.value}".`)
				else
					errors.push(`The ${displayString} field must be equal to ${rule.value}.`)
			}

			// Regex validation (date, email, alphanumeric + dashes)
			for (const [r, msg] of Object.entries({
				date: `The ${displayString} field must be a valid date.`,
				email: `The ${displayString} field must be a valid email.`,
				alpha_dash: `The ${displayString} field can only contain letters, numbers, underscores, and dashes.`,
			})) {
				if (rule[r] && propertyExists)
					if (typeof propertyValue === 'string' && !ValidationRegExpPatterns[r].test(propertyValue))
						errors.push(msg)
			}

			// "Confirmed" validation
			if (rule.confirmed && propertyExists)
				if (model[rule.property + '_confirmation'] !== propertyValue)
					errors.push(`The ${displayString} confirmation does not match.`)
		}

		return errors.length > 0 ? errors : true
	}
}
