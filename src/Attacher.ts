import { Manager } from "./Manager";

export class Attacher {
    ruleContainer: Element;
    ruleTemplate: Element;
    ruleClassName: string = "rule";

    sensorContainer: Element;
    sensorTemplate: Element;
    sensorClassName: string = "sensor";

    relayContainer: Element;
    relayTemplate: Element;
    relayClassName: string = "relay";
    constructor(public manager: Manager) {
        this.ruleTemplate = document.getElementsByClassName(this.ruleClassName)[0];
        this.ruleContainer = this.ruleTemplate.parentElement;
        this.ruleContainer.removeChild(this.ruleTemplate);

        this.sensorTemplate = document.getElementsByClassName(this.sensorClassName)[0];
        this.sensorContainer = this.sensorTemplate.parentElement;
        this.sensorContainer.removeChild(this.sensorTemplate);

        this.relayTemplate = document.getElementsByClassName(this.relayClassName)[0];
        this.relayContainer = this.relayTemplate.parentElement;
        this.relayContainer.removeChild(this.relayTemplate);

        for (const rule of manager.rules) {
            let node: Node = this.ruleTemplate.cloneNode(true);
            this.ruleContainer.appendChild(node);
            rule.element = this.ruleContainer.getElementsByClassName(this.ruleClassName)[this.ruleContainer.childElementCount - 1];
        }
        for (const sensor of manager.sensors) {
            let node: Node = this.sensorTemplate.cloneNode(true);
            this.sensorContainer.appendChild(node);
            sensor.element = this.sensorContainer.getElementsByClassName(this.sensorClassName)[this.sensorContainer.childElementCount - 1];
        }
        for (const relay of manager.relays) {
            let node: Node = this.relayTemplate.cloneNode(true);
            this.relayContainer.appendChild(node);
            relay.element = this.relayContainer.getElementsByClassName(this.relayClassName)[this.relayContainer.childElementCount - 1];
        }
        console.log(this);
    }
}