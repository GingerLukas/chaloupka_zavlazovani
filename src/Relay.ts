import { enableDrop } from "./Helper";
import { IDragAndDrop } from "./IDragAndDrop";
import { ISaveable } from "./ISaveable";
import { Manager } from "./Manager";
import { Realtime } from "./Realtime";
import { Rule } from "./Rule";
import { SharedVariable } from "./SharedVariable";

export class Relay extends Realtime implements ISaveable, IDragAndDrop {
    //#region rule
    get rule(): Rule {
        return this.manager.rules[<number>this.ruleIndexVar.value];
    }
    set rule(rule: Rule) {
        this.ruleIndexVar.value = this.manager.rules.indexOf(rule);
        if (this.ruleIndexVar.value == -1) {
            this.ruleIndexVar.value = 0x7FFFFFFF;
        }
        if (this.ruleElement) {
            if (this.rule) {
                this.ruleElement.value = rule.name;
            }
            else {
                this.ruleElement.value = "";
            }
        }
    }
    //#endregion

    //#region name
    get name(): string {
        return this.nameVar.value.toString();
    }
    set name(text: string) {
        this.nameVar.value = text;
    }
    //#endregion

    nameElement: HTMLInputElement;
    ruleElement: HTMLInputElement;
    _element: Element;
    get element(): Element {
        return this._element;
    }
    set element(el: Element) {
        this._element = el;
        this.element.id = this.id;

        this.ruleElement = <HTMLInputElement>this.element.getElementsByClassName("relay-rule")[1];
        this.nameElement = <HTMLInputElement>this.element.getElementsByClassName("relay-name")[1];

        this.element.getElementsByTagName("button")[0].addEventListener("click", () => this.rule = undefined);

        this.rule = this.rule;

        this.nameVar.bindText(this.nameElement);

        enableDrop(this.element);
    }

    constructor(public nameVar: SharedVariable, public ruleIndexVar: SharedVariable, public stateVar: SharedVariable, public manager: Manager) {
        super(manager);
    }
    getType(): string {
        return "relay";
    }
    handleDrop(obj: IDragAndDrop, target: Element): void {
        if (obj.getType() != "rule") {
            return;
        }
        let rule: Rule = <Rule>obj;
        this.rule = rule;
        console.log(this);
    }
    updateHandler() {

    }

    getUrlSetter(): string {
        return this.nameVar.getUrlSetter() + "&" + this.ruleIndexVar.getUrlSetter();
    }
    static CreateWithProperty(array: Relay[], arrayIndex: number, propertyIndex: number, variable: SharedVariable, manager: Manager): Relay {
        let relay = array[arrayIndex];
        if (relay === undefined) {
            relay = array[arrayIndex] = new Relay(undefined, undefined, undefined, manager);
        }
        switch (propertyIndex % 3) {
            case 0:
                relay.nameVar = variable;
                break;
            case 1:
                relay.ruleIndexVar = variable;
                break;
            case 2:
                relay.stateVar = variable;
                break;
            default:
                break;
        }
        return relay;
    }
}