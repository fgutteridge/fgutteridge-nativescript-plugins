import {
	CSSType,
	View,
	Property,
	CoercibleProperty,
} from '@nativescript/core'

@CSSType('DropDown')
export abstract class DropDownCommon extends View {
	public static selectedIndexChangedEvent = 'selectedIndexChanged'
	public static openedEvent = 'opened'
	public static closedEvent = 'closed'

	public selectedIndex: number
	public items: string[]

	public abstract open()
	public abstract close()
}

export const itemsProperty = new Property<DropDownCommon, string[]>({
    name: 'items',
    valueChanged: (target, oldValue, newValue) => {
		//
    }
})
itemsProperty.register(DropDownCommon)

export const selectedIndexProperty = new CoercibleProperty<DropDownCommon, number>({
    name: 'selectedIndex',
    defaultValue: 0,
    valueConverter: (value) => {
        if (!value)
            return null

        return parseInt(value, 10)
    },
    coerceValue: (target, value) => {
		const { items } = target

        if (items.length !== 0) {
            if (value < 0)
				value = 0

			const maxValue = items.length - 1
            if (value > maxValue)
                value = maxValue
        } else
            value = null

        return value
    }
})
selectedIndexProperty.register(DropDownCommon)
