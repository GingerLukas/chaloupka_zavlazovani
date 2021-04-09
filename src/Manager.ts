import { Attacher } from "./Attacher";
import { RelayIndexes, RuleType, SaveTarget } from "./Enums";
import { IDragAndDrop } from "./IDragAndDrop";
import { ISaveable } from "./ISaveable";
import { Relay } from "./Relay";
import { Rule } from "./Rule";
import { Sensor, SensorType } from "./Sensor";
import { SharedRange } from "./SharedRange";
import { SharedVariable } from "./SharedVariable";

var manager: Manager;

export class Manager extends EventTarget {
    sharedRanges: SharedRange[] = [
        new SharedRange("T", 1, 4, (variable: SharedVariable, index: number) => {
            this.bus_a_names[index] = variable;
            Sensor.CreateWithProperty(this.bus_a, index, 0, variable, manager);
        }, true),
        new SharedRange("T", 11, 14, (variable: SharedVariable, index: number) => {
            this.bus_b_names[index] = variable;
            Sensor.CreateWithProperty(this.bus_b, index, 0, variable, manager);
        }, true),
        new SharedRange("T", 21, 30, (variable: SharedVariable, index: number) => {
            this.rule_names[index] = variable;
            Rule.CreateWithProperty(manager.rules, index, 6, variable, manager);
        }, true),
        new SharedRange("T", 31, 36, (variable: SharedVariable, index: number) => {
            this.relay_names[index] = variable;
            Relay.CreateWithProperty(manager.relays, index, RelayIndexes.TEXT, variable, manager);
        }, true),
        new SharedRange("T", 41, 48, (variable: SharedVariable, index: number) => {
            this.analog_names[index] = variable;
            Sensor.CreateWithProperty(this.analog, index, 0, variable, manager, SensorType.ANALOG);
        }, true),

        new SharedRange("U", 10, 10, (variable: SharedVariable, index: number) => {
            this.timeVar = variable;
        }),
        new SharedRange("U", 11, 16, (variable: SharedVariable, index: number) => {
            this.relay_states[index] = variable;
            Relay.CreateWithProperty(manager.relays, index, RelayIndexes.STATE, variable, manager);
        }),
        new SharedRange("U", 21, 60, (variable: SharedVariable, index: number) => {
            this.rule_info_raw[index] = variable;
            Rule.CreateWithProperty(manager.rules, Math.floor(index / 4), (index % 4) + 2, variable, manager);
        }, true),
        new SharedRange("U", 70, 75, (variable: SharedVariable, index: number) => {
            this.relay_rule_index[index] = variable;
            Relay.CreateWithProperty(manager.relays, index, RelayIndexes.RULE, variable, manager);
        }, true),

        new SharedRange("S", 11, 18, (variable: SharedVariable, index: number) => {
            this.bus_a_raw[index] = variable;
            Sensor.CreateWithProperty(this.bus_a, Math.floor(index / 2), (index % 2) + 1, variable, manager);
        }),
        new SharedRange("S", 21, 28, (variable: SharedVariable, index: number) => {
            this.bus_b_raw[index] = variable;
            Sensor.CreateWithProperty(this.bus_b, Math.floor(index / 2), (index % 2) + 1, variable, manager);
        }),
        new SharedRange("S", 31, 50, (variable: SharedVariable, index: number) => {
            this.rule_range_raw[index] = variable;
            Rule.CreateWithProperty(manager.rules, Math.floor(index / 2), (index % 2), variable, manager);
        }, true),
        new SharedRange("S", 60, 75, (variable: SharedVariable, index: number) => {
            this.analog_raw[index] = variable;
            Sensor.CreateWithProperty(this.analog, Math.floor(index / 2), (index % 2) + 1, variable, manager, SensorType.ANALOG);
        }),
    ];
    updateInterval: number;
    attacher: Attacher;

    loaded = false;
    firstUpdateEvent = new CustomEvent("firstUpdate");
    updateEvent = new CustomEvent("update");



    shared: { [id: string]: SharedVariable } = {};

    timeVar: SharedVariable;

    sensors: Sensor[] = [];

    bus_a: Sensor[] = [];
    bus_a_raw: SharedVariable[] = [];
    bus_a_names: SharedVariable[] = [];
    bus_b: Sensor[] = [];
    bus_b_raw: SharedVariable[] = [];
    bus_b_names: SharedVariable[] = [];

    rules: Rule[] = [];
    rule_range_raw: SharedVariable[] = [];
    rule_info_raw: SharedVariable[] = [];
    rule_names: SharedVariable[] = [];

    relays: Relay[] = [];
    relay_states: SharedVariable[] = [];
    relay_rule_index: SharedVariable[] = [];
    relay_names: SharedVariable[] = [];

    analog_names: SharedVariable[] = [];
    analog_raw: SharedVariable[] = [];
    analog: Sensor[] = [];

    dragAndDrop: { [id: string]: IDragAndDrop } = {};

    lastDragClass = "";

    constructor() {
        super();
        manager = this;
        (window as any).manager = this;

        document.addEventListener("dragstart", (e) => {
            let id = (<Element>e.target).id;
            let type = "text/" + this.dragAndDrop[id].getType();
            e.dataTransfer.items.add(id, type);
            this.lastDragClass = "drag-" + this.dragAndDrop[id].getType();
            document.getElementsByTagName("body")[0].classList.add(this.lastDragClass);
        });
        document.addEventListener("drop", (e) => {
            let element = (<Element>e.target);
            let targetId = element.id;
            while (element && !targetId) {
                element = element.parentElement;
                targetId = element.id;
            }
            let item = e.dataTransfer.items[0];
            let target = <Element>e.target;
            item.getAsString((originId) => {
                this.dragAndDrop[targetId].handleDrop(this.dragAndDrop[originId], target);
            })
        });
        document.addEventListener("dragend", (e) => {
            document.getElementsByTagName("body")[0].classList.remove(this.lastDragClass);
        });

        this.addEventListener("firstUpdate", this.firstUpdateHandler);
        this.update();
    }

    sendSharedWriteRequest(data: string) {
        console.log(data);
        let req = new XMLHttpRequest();
        req.open("GET", "http://192.168.1.133/sv?" + data);
        req.send();
    }

    save(target: SaveTarget = SaveTarget.ALL) {
        switch (target) {
            default:
            case SaveTarget.ALL:
                this.save(SaveTarget.SENSOR);
                this.save(SaveTarget.RULE);
                this.save(SaveTarget.RELAY);
                return;
            case SaveTarget.SENSOR:
                for (const sensor of this.sensors) {
                    this.sendSharedWriteRequest(sensor.getUrlSetter());
                }
                break;
            case SaveTarget.RULE:
                for (const rule of this.rules) {
                    this.sendSharedWriteRequest(rule.getUrlSetter());
                }
                break;
            case SaveTarget.RELAY:
                for (const relay of this.relays) {
                    this.sendSharedWriteRequest(relay.getUrlSetter());
                }
                break;
        }
    }

    update() {
        let req = new XMLHttpRequest();
        function handler() {
            let responseArr = req.responseText.split("|");
            for (let i = 0; i < responseArr.length; i += 2) {
                manager.handleSharedVar(responseArr[i], responseArr[i + 1])
            }

            if (!manager.loaded) {
                manager.dispatchEvent(manager.firstUpdateEvent);
                manager.loaded = true;
            }
            else {
                manager.dispatchEvent(manager.updateEvent);
            }
        }

        req.open("GET", "http://192.168.1.133/shared.txt");
        req.addEventListener("load", handler);
        req.send();
    }

    handleSharedVar(name: string, value: string) {
        if (name.length == 0) {
            return;
        }
        let val: string | number = 0;
        let sharedVar = this.shared[name];
        if (sharedVar === undefined) {
            sharedVar = new SharedVariable(name, val);
            this.shared[name] = sharedVar;
        }
        if (!sharedVar.realTime) {
            return;
        }
        switch (name[0]) {
            case "e":
            case "u":
            case "S":
            case "U":
                val = parseInt(value);
                break;
            case "T":
            default:
                val = value;
                break;
        }
        sharedVar.value = val;
        return sharedVar;
    }

    firstUpdateHandler() {
        console.log(this);
        for (const key in this.shared) {
            let variable = this.shared[key];
            for (const range of this.sharedRanges) {
                range.handleSharedVar(variable);
            }
        }

        this.sensors = this.sensors.concat(this.bus_a, this.bus_b, this.analog);
        for (let item of (<IDragAndDrop[]>this.rules).concat(this.sensors, this.relays)) {
            this.dragAndDrop[item.id] = item;
        }

        this.attacher = new Attacher(manager);

        //@ts-ignore
        manager.updateInterval = setInterval(manager.update, 1000);
    }

    getSensor(index: number): Sensor {
        if (index < this.bus_a.length) {
            return this.bus_a[index];
        }
        if ((index -= this.bus_a.length) < this.bus_b.length) {
            return this.bus_b[index];
        }
        return this.analog[index - this.bus_b.length];
    }

    getSensorRelativeIndex(sensor: Sensor): number {
        let index: number = this.bus_a.indexOf(sensor);

        if (index == -1) {
            index = this.bus_b.indexOf(sensor);
            if (index == -1) {
                index = this.analog.indexOf(sensor) + this.bus_a.length + this.bus_b.length;
            }
            else {
                index += this.bus_a.length;
            }
        }
        return index;
    }
}

