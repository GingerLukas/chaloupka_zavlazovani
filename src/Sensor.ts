import { addRelativeCallback, createDragTarget, uuidv4 } from "./Helper";
import { IDragAndDrop } from "./IDragAndDrop";
import { ISaveable } from "./ISaveable";
import { Manager } from "./Manager";
import { Realtime } from "./Realtime";
import { SharedVariable } from "./SharedVariable";

export class Sensor extends Realtime implements ISaveable, IDragAndDrop {
    //#region main
    get main(): number | string {
        return this.mainVar.value;
    }
    //#endregion

    //#region misc
    get misc(): number | string {
        return this.miscVar.value;
    }
    //#endregion

    //#region mainName
    get mainName(): string {
        return this.mainNameVar.value.toString();
    }
    set mainName(text: string) {
        this.mainNameVar.value = text;
    }
    //#endregion

    sensorMain: Element;
    sensorMisc: Element;
    sensorName: HTMLInputElement;
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
        this.sensorMain = this.element.getElementsByClassName("sensor-main")[1];
        this.sensorMisc = this.element.getElementsByClassName("sensor-misc")[1];
        this.sensorName = this.element.querySelector("input.sensor-name-main");
        if (this.sensorName && this.mainNameVar) {
            switch (this.type) {
                case SensorType.GENERAL:
                    this.mainNameVar.bindText(this.sensorName);
                    break;
                case SensorType.ANALOG:
                    (<HTMLInputElement>this.sensorName).value = this.mainNameVar._value.toString();
                    this.sensorName.setAttribute("readonly", "true");
                    break;
                default:
                    break;
            }
        }
    }

    constructor(
        public mainNameVar: SharedVariable,
        public miscNameVar: SharedVariable,
        public mainVar: SharedVariable,
        public miscVar: SharedVariable,
        public manager: Manager,
        public type: SensorType = SensorType.GENERAL
    ) {
        super(manager);
    }
    getType(): string {
        return "sensor";
    }
    handleDrop(obj: IDragAndDrop, target: Element): void {
        throw new Error("Method not implemented.");
    }
    static CreateWithProperty(
        array: Sensor[],
        arrayIndex: number,
        propertyIndex: number,
        variable: SharedVariable,
        manager: Manager,
        type: SensorType = SensorType.GENERAL
    ): Sensor {
        let sensor = array[arrayIndex];
        if (sensor === undefined) {
            sensor = array[arrayIndex] = new Sensor(undefined, undefined, undefined, undefined, manager, type);
        }
        switch (propertyIndex % 3) {
            case 0:
                sensor.mainNameVar = variable;
                break;
            case 1:
                sensor.mainVar = variable;
                break;
            case 2:
                sensor.miscVar = variable;
                break;
            default:
                break;
        }
        return sensor;
    }
    getUrlSetter(): string {
        if (this.type == SensorType.ANALOG) {
            return "U99=0"
        }
        return this.mainNameVar.getUrlSetter();
    }

    updateHandler() {
        if (this.sensorMain && this.mainVar) this.sensorMain.innerHTML = this.main.toString();
        if (this.sensorMisc && this.miscVar) this.sensorMisc.innerHTML = this.misc.toString();
    }
}

export enum SensorType {
    GENERAL,
    ANALOG,
}
