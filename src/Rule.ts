import { RuleType } from "./Enums";
import { addRelativeCallback, createDragTarget, enableDrop, secondsToDate } from "./Helper";
import { IDragAndDrop } from "./IDragAndDrop";
import { ISaveable } from "./ISaveable";
import { Manager } from "./Manager";
import { Realtime } from "./Realtime";
import { Sensor } from "./Sensor";
import { SharedVariable } from "./SharedVariable";

export class Rule extends Realtime implements ISaveable, IDragAndDrop {
    //#region name
    get name(): string {
        return this.nameVar.value.toString();
    }
    set name(value: string) {
        this.nameVar.value = value;
    }
    //#endregion

    //#region start
    get start(): string | number {
        return this.startVar.value;
    }
    set start(s: string | number) {
        this.startVar.value = s;
    }
    //#endregion

    //#region end
    get end(): string | number {
        return this.endVar.value;
    }
    set end(s: string | number) {
        this.endVar.value = s;
    }
    //#endregion

    //#region type
    get type(): RuleType {
        return <number>this.typeVar.value;
    }
    set type(type: RuleType) {
        this.typeVar.value = type;
    }
    //#endregion

    //#region target
    get target(): Sensor {
        return this.manager.getSensor(<number>this.targetVar.value);
    }
    set target(sensor: Sensor) {
        let index = this.manager.getSensorRelativeIndex(sensor);
        if (index != -1) {
            this.targetVar.value = index;
        }
        if (this.sensorElement && sensor) {
            (<HTMLInputElement>this.sensorElement).value = sensor.mainName;
        }
    }
    //#endregion

    //#region subRuleA
    get subRuleA(): Rule {
        return this.manager.rules[<number>this.subRuleAVar.value];
    }
    set subRuleA(rule: Rule) {
        this.subRuleAVar.value = this.manager.rules.indexOf(rule);
        if (this.subRuleAVar.value == -1) {
            this.subRuleAVar.value = 0x7FFFFFFF;
        }
        if (this.subRuleAElement) {
            if (this.subRuleA) {
                this.subRuleAElement.value = this.subRuleA.name;
            }
            else {
                this.subRuleAElement.value = "";
            }
        }
    }
    //#endregion

    //#region subRuleB
    get subRuleB(): Rule {
        return this.manager.rules[<number>this.subRuleBVar.value];
    }
    set subRuleB(rule: Rule) {
        this.subRuleBVar.value = this.manager.rules.indexOf(rule);
        if (this.subRuleBVar.value == -1) {
            this.subRuleBVar.value = 0x7FFFFFFF;
        }
        if (this.subRuleBElement) {
            if (this.subRuleB) {
                this.subRuleBElement.value = this.subRuleB.name;
            }
            else {
                this.subRuleBElement.value = "";
            }
        }
    }
    //#endregion

    constructor(
        private nameVar: SharedVariable,
        private startVar: SharedVariable,
        private endVar: SharedVariable,
        private typeVar: SharedVariable,
        private targetVar: SharedVariable,
        private subRuleAVar: SharedVariable,
        private subRuleBVar: SharedVariable,
        private mailVar: SharedVariable,
        private manager: Manager
    ) {
        super(manager);
    }
    getType(): string {
        return "rule";
    }
    handleDrop(obj: IDragAndDrop, target: Element): void {
        switch (obj.getType()) {
            case "sensor":
                this.target = <Sensor><any>obj;
                break;
            case "rule":
                let aIndex = target.classList.contains("rule-a");
                let bIndex = target.classList.contains("rule-b");
                if (aIndex) this.subRuleA = <Rule>obj;
                if (bIndex) this.subRuleB = <Rule>obj;
                break;
            default:
                break;
        }
        console.log(this);
    }
    static CreateWithProperty(array: Rule[], arrayIndex: number, propertyIndex: number, variable: SharedVariable, manager: Manager): Rule {
        let rule = array[arrayIndex];
        if (rule === undefined) {
            rule = array[arrayIndex] = new Rule(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, manager);
        }
        switch (propertyIndex % 8) {
            case 0:
                rule.startVar = variable;
                break;
            case 1:
                rule.endVar = variable;
                break;
            case 2:
                rule.typeVar = variable;
                break;
            case 3:
                rule.targetVar = variable;
                break;
            case 4:
                rule.subRuleAVar = variable;
                break;
            case 5:
                rule.subRuleBVar = variable;
                break;
            case 6:
                rule.nameVar = variable;
                break;
            case 7:
                rule.mailVar = variable;
                break;
            default:
                break;
        }
        return rule;
    }

    private _element: Element;
    get element(): Element {
        return this._element;
    }
    set element(el: Element) {
        this._element = el;
        if (this.element === undefined) {
            return;
        }
        this.element.id = this.id;
        this.nameElement = <HTMLInputElement>this.element.getElementsByClassName("rule-name")[1];
        this.startElement = <HTMLInputElement>this.element.getElementsByClassName("rule-start")[1];
        this.endElement = <HTMLInputElement>this.element.getElementsByClassName("rule-end")[1];
        this.sensorElement = this.element.getElementsByClassName("rule-sensor")[1];
        this.sensorTypeElement = <HTMLSelectElement>this.element.getElementsByClassName("rule-sensor-type")[1];
        this.subRuleAElement = <HTMLInputElement>this.element.getElementsByClassName("rule-a")[1];
        this.subRuleBElement = <HTMLInputElement>this.element.getElementsByClassName("rule-b")[1];
        this.mailCheckbox = <HTMLInputElement>this.element.getElementsByClassName("rule-mail")[1];

        this.subRuleAClearButton = this.element.getElementsByClassName("rule-a")[0].getElementsByTagName("button")[0];
        this.subRuleBClearButton = this.element.getElementsByClassName("rule-b")[0].getElementsByTagName("button")[0];

        this.subRuleAClearButton.addEventListener("click", () => this.subRuleA = undefined);
        this.subRuleBClearButton.addEventListener("click", () => this.subRuleB = undefined);

        this.typeVar.bindSelect(this.sensorTypeElement, () => { this.updateStyle() });
        this.mailVar.bindCheckbox(this.mailCheckbox);
        this.nameVar.bindText(this.nameElement);

        this.target = this.target;
        this.subRuleA = this.subRuleA;
        this.subRuleB = this.subRuleB;

        this.updateStyle();

        enableDrop(this.element);
    }
    nameElement: HTMLInputElement;
    startElement: HTMLInputElement;
    endElement: HTMLInputElement;
    sensorElement: Element;
    sensorTypeElement: HTMLSelectElement;
    subRuleAElement: HTMLInputElement;
    subRuleBElement: HTMLInputElement;
    subRuleAClearButton: HTMLButtonElement;
    subRuleBClearButton: HTMLButtonElement;
    mailCheckbox: HTMLInputElement;
    updateHandler() { }

    _prevType: RuleType = 0;
    updateStyle() {
        this.element.classList.remove(RuleType[this._prevType]);
        this.element.classList.add(RuleType[this.type]);
        this._prevType = this.type;

        switch (this.type) {
            case RuleType.BUS_MAIN:
            case RuleType.BUS_MISC:
            case RuleType.CPWM:
                this.startElement.type = "text";
                this.endElement.type = "text";
                this.startElement.value = this.start.toString();
                this.endElement.value = this.end.toString();
                break;
            case RuleType.TIME:
                this.startElement.type = "time";
                this.endElement.type = "time";
                this.startElement.value = secondsToDate(<number>this.start);
                this.endElement.value = secondsToDate(<number>this.end);
                break;
        }
    }

    getUrlSetter(): string {
        this.startVar.set(this.startElement.value, this.type);
        this.endVar.set(this.endElement.value, this.type);
        return (
            this.nameVar.getUrlSetter() +
            "&" +
            this.startVar.getUrlSetter() +
            "&" +
            this.endVar.getUrlSetter() +
            "&" +
            this.typeVar.getUrlSetter() +
            "&" +
            this.targetVar.getUrlSetter() +
            "&" +
            this.subRuleAVar.getUrlSetter() +
            "&" +
            this.subRuleBVar.getUrlSetter() +
            "&" +
            this.mailVar.getUrlSetter()
        );
    }
}
