import { DropDownCommon, selectedIndexProperty } from './common'
import { SelectedIndexChangedEventData } from '.'
import {
	Color,
	colorProperty,
	Font,
	fontInternalProperty,
	paddingTopProperty,
	paddingRightProperty,
	paddingBottomProperty,
	paddingLeftProperty,
	Length
} from '@nativescript/core'
import { layout } from '@nativescript/core/utils'

export class DropDown extends DropDownCommon {
	public nativeViewProtected: DropDownLabel

	private _toolbar: UIToolbar
	private _doneButton: UIBarButtonItem
	private _toolbarSpacer: UIBarButtonItem
	private _doneButtonDelegate: DoneButtonDelegate

	private _pickerView: UIPickerView
	private _pickerViewDelegate: UIPickerViewDelegateImpl
	private _pickerViewDataSource: UIPickerViewDataSourceImpl

	public createNativeView() {
		const dropDown = DropDownLabel.initWithOwner(new WeakRef(this))
		dropDown.userInteractionEnabled = true

		return dropDown
	}

	public initNativeView() {
		super.initNativeView()

		this._pickerView = UIPickerView.new()
		this._doneButtonDelegate = DoneButtonDelegate.initWithOwner(new WeakRef(this))
		this._pickerViewDelegate = UIPickerViewDelegateImpl.initWithOwner(new WeakRef(this))
		this._pickerViewDataSource = UIPickerViewDataSourceImpl.initWithOwner(new WeakRef(this))

		this._toolbarSpacer = UIBarButtonItem.alloc().initWithBarButtonSystemItemTargetAction(UIBarButtonSystemItem.FlexibleSpace, null, '')
		this._doneButton = UIBarButtonItem.alloc().initWithBarButtonSystemItemTargetAction(UIBarButtonSystemItem.Done, this._doneButtonDelegate, 'tap')

		this._toolbar = UIToolbar.new()
		this._toolbar.sizeToFit()
		this._toolbar.setItemsAnimated([this._toolbarSpacer, this._doneButton], true)
		this._toolbar.userInteractionEnabled = true

		this.ios.inputView = this._pickerView
		this.ios.inputAccessoryView = this._toolbar
	}

	public disposeNativeView() {
        this._doneButtonDelegate = null
        this._pickerViewDelegate = null
        this._pickerViewDataSource = null

        this.ios.inputView = null
        this.ios.inputAccessoryView = null

        this._pickerView = null
        this._toolbar = null
		this._doneButton = null
		this._toolbarSpacer = null

        super.disposeNativeView()
    }

	public onLoaded() {
		super.onLoaded()

		this._pickerView.delegate = this._pickerViewDelegate
		this._pickerView.dataSource = this._pickerViewDataSource
	}

	public onUnloaded() {
		this._pickerView.delegate = null
		this._pickerView.dataSource = null

		super.onUnloaded()
	}

	get ios(): DropDownLabel {
        return this.nativeViewProtected
    }

	public open() {
		if (this.isEnabled)
			this.ios.becomeFirstResponder()
	}

	public close() {
		this.ios.resignFirstResponder()
	}

	public [selectedIndexProperty.getDefault](): number {
		return 0
	}
	public [selectedIndexProperty.setNative](value: number) {
		this._pickerView.selectRowInComponentAnimated(value, 0, true)
		this.nativeViewProtected.text = this.items[value]
	}

	public [colorProperty.getDefault](): UIColor {
		return this.nativeViewProtected.textColor
	}
	public [colorProperty.setNative](value: Color | UIColor) {
		this.nativeViewProtected.textColor = value instanceof Color ? value.ios : value
	}

	public [fontInternalProperty.getDefault](): UIFont {
		return this.nativeViewProtected.font
	}
	public [fontInternalProperty.setNative](value: Font | UIFont) {
		this.nativeViewProtected.font = value instanceof Font ? value.getUIFont(this.nativeViewProtected.font) : value
	}

	public [paddingTopProperty.setNative](value: Length) {
		this.nativeViewProtected.padding = Object.assign(this.nativeViewProtected.padding, { top: layout.toDeviceIndependentPixels(this.effectivePaddingTop) })
    }
    public [paddingRightProperty.setNative](value: Length) {
		this.nativeViewProtected.padding = Object.assign(this.nativeViewProtected.padding, { right: layout.toDeviceIndependentPixels(this.effectivePaddingRight) })
    }
    public [paddingBottomProperty.setNative](value: Length) {
		this.nativeViewProtected.padding = Object.assign(this.nativeViewProtected.padding, { bottom: layout.toDeviceIndependentPixels(this.effectivePaddingBottom) })
    }
    public [paddingLeftProperty.setNative](value: Length) {
        this.nativeViewProtected.padding = Object.assign(this.nativeViewProtected.padding, { left: layout.toDeviceIndependentPixels(this.effectivePaddingLeft) })
    }
}

@NativeClass
export class UIPickerViewDelegateImpl extends NSObject implements UIPickerViewDelegate {
	static ObjCProtocols = [UIPickerViewDelegate]
	private _owner: WeakRef<DropDown>

	public static initWithOwner(owner: WeakRef<DropDown>): UIPickerViewDelegateImpl {
		const delegate = super.new() as UIPickerViewDelegateImpl
		delegate._owner = owner

		return delegate
	}

	public pickerViewDidSelectRowInComponent(pickerView: UIPickerView, row: number, component: number) {
		const owner = this._owner.get()
		if (!owner.ios.isFirstResponder) {
			pickerView.selectRowInComponentAnimated(owner.selectedIndex, 0, false)
			return
		}

		owner.notify(<SelectedIndexChangedEventData>{
			eventName: DropDownCommon.selectedIndexChangedEvent,
			object: owner,
			oldIndex: owner.selectedIndex,
			newIndex: row
		})
		owner.ios.text = owner.items[row]
	}

	public pickerViewTitleForRowForComponent(pickerView: UIPickerView, row: number, component: number) {
		return this._owner.get().items[row]
	}
}

@NativeClass
export class UIPickerViewDataSourceImpl extends NSObject implements UIPickerViewDataSource {
	static ObjCProtocols = [UIPickerViewDataSource]
	private _owner: WeakRef<DropDown>

	public static initWithOwner(owner: WeakRef<DropDown>): UIPickerViewDataSourceImpl {
		const delegate = super.new() as UIPickerViewDataSourceImpl
		delegate._owner = owner

		return delegate
	}

	public numberOfComponentsInPickerView(pickerView: UIPickerView) {
		return 1
	}

	public pickerViewNumberOfRowsInComponent(pickerView: UIPickerView, component: number) {
		return this._owner.get().items.length
	}
}

@NativeClass
class DoneButtonDelegate extends NSObject {
	private _owner: WeakRef<DropDown>

	static initWithOwner(owner: WeakRef<DropDown>): DoneButtonDelegate {
		const delegate = super.new() as DoneButtonDelegate
		delegate._owner = owner

		return delegate
	}

	@ObjCMethod()
	public tap() {
		this._owner.get().close()
	}
}

@NativeClass
export class DropDownLabel extends TNSLabel {
	public nativeView: TNSLabel

	private _owner: WeakRef<DropDown>
	private _inputView: UIView
	private _inputAccessoryView: UIView
	private _isInputViewOpen: boolean

	get inputView(): UIView {
        return this._inputView
    }
    set inputView(value: UIView) {
        this._inputView = value
    }

    get inputAccessoryView(): UIView {
        return this._inputAccessoryView
    }
    set inputAccessoryView(value: UIView) {
        this._inputAccessoryView = value
	}

	get canBecomeFirstResponder(): boolean {
        return true
    }

    get canResignFirstResponder(): boolean {
        return true
    }

	public static initWithOwner(owner: WeakRef<DropDown>): DropDownLabel {
		const label = super.new() as DropDownLabel

		label._owner = owner
		label._isInputViewOpen = false
		label.text = owner.get().items[0]
		label.addGestureRecognizer(UITapGestureRecognizer.alloc().initWithTargetAction(label, 'tap'))

		return label
	}

	@ObjCMethod()
	public tap(@ObjCParam(UITapGestureRecognizer) sender: UITapGestureRecognizer) {
		const owner = this._owner.get()
		if (owner.isEnabled)
			this.becomeFirstResponder()
	}

	public becomeFirstResponder(): boolean {
		const result = super.becomeFirstResponder()

        if (result) {
            if (!this._isInputViewOpen) {
                const owner = this._owner.get()

                owner.notify({
                    eventName: DropDownCommon.openedEvent,
                    object: owner
                })
            }

            this._isInputViewOpen = true
        }

        return result
    }

    public resignFirstResponder(): boolean {
        const result = super.resignFirstResponder()
        const owner = this._owner.get()

        if (result) {
            this._isInputViewOpen = false

            owner.notify({
                eventName: DropDownCommon.closedEvent,
                object: owner
            })
		}

		return result
    }
}
