import { RuleType } from "./Enums";
import { addRelativeCallback, dateToSeconds, pad } from "./Helper";
import { ISaveable } from "./ISaveable";

export class SharedVariable implements ISaveable {
	name: string;
	_value: string | number;
	_type: BindType;
	get value(): string | number {
		return this._value;
	}
	set value(val: string | number) {
		this._value = val;
		if (this._target !== undefined) {
			switch (this._type) {
				case BindType.Text:
					(<HTMLInputElement>this._target).value = val.toString();
					break;
				case BindType.Select:
					(<HTMLSelectElement>this._target).options.selectedIndex = <number>val;
					break;
				case BindType.Checkbox:
					(<HTMLInputElement>this._target).checked = val ? true : false;
					break;
				default:
					break;
			}
		}
	}
	index: number;
	realTime: Boolean = true;
	constructor(name: string, value: string | number) {
		this.name = name;
		this.value = value;
		this.index = parseInt(name.slice(1));
	}
	getUrlSetter(): string {
		return this.name + "=" + this.value;
	}
	set(val: string, type: RuleType) {
		switch (type) {
			case RuleType.BUS_MAIN:
			case RuleType.BUS_MISC:
			case RuleType.CPWM:
				this._value = parseInt(val);
				break;
			case RuleType.TIME:
				this._value = dateToSeconds(val);
				break;
		}
	}
	private _target: Element;
	bindText(target: HTMLInputElement, action: () => any = null) {
		this._type = BindType.Text;
		this._target = target;
		addRelativeCallback(this._target, "change", this, (x) => {
			x._value = (<HTMLInputElement>x._target).value;
			if (action) {
				action();
			}
			//TODO: remove debug
			console.log(x);
		});
		this.value = this.value;
	}
	bindCheckbox(target: HTMLInputElement, action: () => any = null) {
		this._type = BindType.Checkbox;
		this._target = target;
		addRelativeCallback(this._target, "change", this, (x) => {
			x._value = (<HTMLInputElement>x._target).checked ? 1 : 0;
			if (action) {
				action();
			}
			//TODO: remove debug
			console.log(x);
		});
		this.value = this.value;
	}
	bindSelect(target: HTMLSelectElement, action: () => any = null) {
		this._type = BindType.Select;
		this._target = target;
		addRelativeCallback(this._target, "change", this, (x) => {
			x._value = (<HTMLSelectElement>x._target).options.selectedIndex;
			if (action) {
				action();
			}
			//TODO: remove debug
			console.log(x);
		});
		this.value = this.value;
	}
}

enum BindType {
	Text,
	Select,
	Checkbox
}
