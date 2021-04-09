/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Attacher.ts":
/*!*************************!*\
  !*** ./src/Attacher.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Attacher = void 0;
class Attacher {
    constructor(manager) {
        this.manager = manager;
        this.ruleClassName = "rule";
        this.sensorClassName = "sensor";
        this.relayClassName = "relay";
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
            let node = this.ruleTemplate.cloneNode(true);
            this.ruleContainer.appendChild(node);
            rule.element = this.ruleContainer.getElementsByClassName(this.ruleClassName)[this.ruleContainer.childElementCount - 1];
        }
        for (const sensor of manager.sensors) {
            let node = this.sensorTemplate.cloneNode(true);
            this.sensorContainer.appendChild(node);
            sensor.element = this.sensorContainer.getElementsByClassName(this.sensorClassName)[this.sensorContainer.childElementCount - 1];
        }
        for (const relay of manager.relays) {
            let node = this.relayTemplate.cloneNode(true);
            this.relayContainer.appendChild(node);
            relay.element = this.relayContainer.getElementsByClassName(this.relayClassName)[this.relayContainer.childElementCount - 1];
        }
        console.log(this);
    }
}
exports.Attacher = Attacher;


/***/ }),

/***/ "./src/Enums.ts":
/*!**********************!*\
  !*** ./src/Enums.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SaveTarget = exports.RelayIndexes = exports.RuleType = void 0;
var RuleType;
(function (RuleType) {
    RuleType[RuleType["NONE"] = 0] = "NONE";
    RuleType[RuleType["TIME"] = 1] = "TIME";
    RuleType[RuleType["BUS_MAIN"] = 2] = "BUS_MAIN";
    RuleType[RuleType["BUS_MISC"] = 3] = "BUS_MISC";
    RuleType[RuleType["CPWM"] = 4] = "CPWM";
    RuleType[RuleType["rule_none"] = 0] = "rule_none";
    RuleType[RuleType["rule_time"] = 1] = "rule_time";
    RuleType[RuleType["rule_temp"] = 2] = "rule_temp";
    RuleType[RuleType["rule_humi"] = 3] = "rule_humi";
    RuleType[RuleType["rule_cpwm"] = 4] = "rule_cpwm";
})(RuleType = exports.RuleType || (exports.RuleType = {}));
var RelayIndexes;
(function (RelayIndexes) {
    RelayIndexes[RelayIndexes["TEXT"] = 0] = "TEXT";
    RelayIndexes[RelayIndexes["RULE"] = 1] = "RULE";
    RelayIndexes[RelayIndexes["STATE"] = 2] = "STATE";
})(RelayIndexes = exports.RelayIndexes || (exports.RelayIndexes = {}));
var SaveTarget;
(function (SaveTarget) {
    SaveTarget[SaveTarget["ALL"] = 0] = "ALL";
    SaveTarget[SaveTarget["SENSOR"] = 1] = "SENSOR";
    SaveTarget[SaveTarget["RULE"] = 2] = "RULE";
    SaveTarget[SaveTarget["RELAY"] = 3] = "RELAY";
})(SaveTarget = exports.SaveTarget || (exports.SaveTarget = {}));


/***/ }),

/***/ "./src/Helper.ts":
/*!***********************!*\
  !*** ./src/Helper.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.enableDrop = exports.dateToSeconds = exports.secondsToDate = exports.uuidv4 = exports.createDragTarget = exports.addRelativeCallback = exports.pad = void 0;
function pad(num, size) {
    num = num.toString();
    while (num.length < size)
        num = "0" + num;
    return num;
}
exports.pad = pad;
function addRelativeCallback(target, event, obj, callback) {
    (function (s, m, call) {
        m.addEventListener(event, () => callback(s), false);
    })(obj, target, callback);
}
exports.addRelativeCallback = addRelativeCallback;
function createDragTarget(element) {
    element.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
}
exports.createDragTarget = createDragTarget;
function uuidv4() {
    //@ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
exports.uuidv4 = uuidv4;
function secondsToDate(seconds) {
    let h = Math.floor(seconds / 3600);
    seconds %= 3600;
    let m = Math.floor(seconds / 60);
    seconds %= 60;
    return pad(h, 2) + ":" + pad(m, 2) + ":" + pad(seconds, 2);
}
exports.secondsToDate = secondsToDate;
function dateToSeconds(date) {
    let arr = date.split(":");
    let sum = 0;
    if (arr[0]) {
        sum += parseInt(arr[0]) * 3600;
    }
    if (arr[1]) {
        sum += parseInt(arr[1]) * 60;
    }
    if (arr[2]) {
        sum += parseInt(arr[2]);
    }
    return sum;
}
exports.dateToSeconds = dateToSeconds;
function enableDrop(target) {
    target.addEventListener("dragover", x => {
        x.preventDefault();
        x.stopPropagation();
    });
}
exports.enableDrop = enableDrop;


/***/ }),

/***/ "./src/Manager.ts":
/*!************************!*\
  !*** ./src/Manager.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Manager = void 0;
const Attacher_1 = __webpack_require__(/*! ./Attacher */ "./src/Attacher.ts");
const Enums_1 = __webpack_require__(/*! ./Enums */ "./src/Enums.ts");
const Relay_1 = __webpack_require__(/*! ./Relay */ "./src/Relay.ts");
const Rule_1 = __webpack_require__(/*! ./Rule */ "./src/Rule.ts");
const Sensor_1 = __webpack_require__(/*! ./Sensor */ "./src/Sensor.ts");
const SharedRange_1 = __webpack_require__(/*! ./SharedRange */ "./src/SharedRange.ts");
const SharedVariable_1 = __webpack_require__(/*! ./SharedVariable */ "./src/SharedVariable.ts");
var manager;
class Manager extends EventTarget {
    constructor() {
        super();
        this.sharedRanges = [
            new SharedRange_1.SharedRange("T", 1, 4, (variable, index) => {
                this.bus_a_names[index] = variable;
                Sensor_1.Sensor.CreateWithProperty(this.bus_a, index, 0, variable, manager);
            }, true),
            new SharedRange_1.SharedRange("T", 11, 14, (variable, index) => {
                this.bus_b_names[index] = variable;
                Sensor_1.Sensor.CreateWithProperty(this.bus_b, index, 0, variable, manager);
            }, true),
            new SharedRange_1.SharedRange("T", 21, 30, (variable, index) => {
                this.rule_names[index] = variable;
                Rule_1.Rule.CreateWithProperty(manager.rules, index, 6, variable, manager);
            }, true),
            new SharedRange_1.SharedRange("T", 31, 36, (variable, index) => {
                this.relay_names[index] = variable;
                Relay_1.Relay.CreateWithProperty(manager.relays, index, Enums_1.RelayIndexes.TEXT, variable, manager);
            }, true),
            new SharedRange_1.SharedRange("T", 41, 48, (variable, index) => {
                this.analog_names[index] = variable;
                Sensor_1.Sensor.CreateWithProperty(this.analog, index, 0, variable, manager, Sensor_1.SensorType.ANALOG);
            }, true),
            new SharedRange_1.SharedRange("U", 10, 10, (variable, index) => {
                this.timeVar = variable;
            }),
            new SharedRange_1.SharedRange("U", 11, 16, (variable, index) => {
                this.relay_states[index] = variable;
                Relay_1.Relay.CreateWithProperty(manager.relays, index, Enums_1.RelayIndexes.STATE, variable, manager);
            }),
            new SharedRange_1.SharedRange("U", 21, 60, (variable, index) => {
                this.rule_info_raw[index] = variable;
                Rule_1.Rule.CreateWithProperty(manager.rules, Math.floor(index / 4), (index % 4) + 2, variable, manager);
            }, true),
            new SharedRange_1.SharedRange("U", 70, 75, (variable, index) => {
                this.relay_rule_index[index] = variable;
                Relay_1.Relay.CreateWithProperty(manager.relays, index, Enums_1.RelayIndexes.RULE, variable, manager);
            }, true),
            new SharedRange_1.SharedRange("S", 11, 18, (variable, index) => {
                this.bus_a_raw[index] = variable;
                Sensor_1.Sensor.CreateWithProperty(this.bus_a, Math.floor(index / 2), (index % 2) + 1, variable, manager);
            }),
            new SharedRange_1.SharedRange("S", 21, 28, (variable, index) => {
                this.bus_b_raw[index] = variable;
                Sensor_1.Sensor.CreateWithProperty(this.bus_b, Math.floor(index / 2), (index % 2) + 1, variable, manager);
            }),
            new SharedRange_1.SharedRange("S", 31, 50, (variable, index) => {
                this.rule_range_raw[index] = variable;
                Rule_1.Rule.CreateWithProperty(manager.rules, Math.floor(index / 2), (index % 2), variable, manager);
            }, true),
            new SharedRange_1.SharedRange("S", 60, 75, (variable, index) => {
                this.analog_raw[index] = variable;
                Sensor_1.Sensor.CreateWithProperty(this.analog, Math.floor(index / 2), (index % 2) + 1, variable, manager, Sensor_1.SensorType.ANALOG);
            }),
        ];
        this.loaded = false;
        this.firstUpdateEvent = new CustomEvent("firstUpdate");
        this.updateEvent = new CustomEvent("update");
        this.shared = {};
        this.sensors = [];
        this.bus_a = [];
        this.bus_a_raw = [];
        this.bus_a_names = [];
        this.bus_b = [];
        this.bus_b_raw = [];
        this.bus_b_names = [];
        this.rules = [];
        this.rule_range_raw = [];
        this.rule_info_raw = [];
        this.rule_names = [];
        this.relays = [];
        this.relay_states = [];
        this.relay_rule_index = [];
        this.relay_names = [];
        this.analog_names = [];
        this.analog_raw = [];
        this.analog = [];
        this.dragAndDrop = {};
        this.lastDragClass = "";
        manager = this;
        window.manager = this;
        document.addEventListener("dragstart", (e) => {
            let id = e.target.id;
            let type = "text/" + this.dragAndDrop[id].getType();
            e.dataTransfer.items.add(id, type);
            this.lastDragClass = "drag-" + this.dragAndDrop[id].getType();
            document.getElementsByTagName("body")[0].classList.add(this.lastDragClass);
        });
        document.addEventListener("drop", (e) => {
            let element = e.target;
            let targetId = element.id;
            while (element && !targetId) {
                element = element.parentElement;
                targetId = element.id;
            }
            let item = e.dataTransfer.items[0];
            let target = e.target;
            item.getAsString((originId) => {
                this.dragAndDrop[targetId].handleDrop(this.dragAndDrop[originId], target);
            });
        });
        document.addEventListener("dragend", (e) => {
            document.getElementsByTagName("body")[0].classList.remove(this.lastDragClass);
        });
        this.addEventListener("firstUpdate", this.firstUpdateHandler);
        this.update();
    }
    sendSharedWriteRequest(data) {
        console.log(data);
        let req = new XMLHttpRequest();
        req.open("GET", "http://192.168.1.133/sv?" + data);
        req.send();
    }
    save(target = Enums_1.SaveTarget.ALL) {
        switch (target) {
            default:
            case Enums_1.SaveTarget.ALL:
                this.save(Enums_1.SaveTarget.SENSOR);
                this.save(Enums_1.SaveTarget.RULE);
                this.save(Enums_1.SaveTarget.RELAY);
                return;
            case Enums_1.SaveTarget.SENSOR:
                for (const sensor of this.sensors) {
                    this.sendSharedWriteRequest(sensor.getUrlSetter());
                }
                break;
            case Enums_1.SaveTarget.RULE:
                for (const rule of this.rules) {
                    this.sendSharedWriteRequest(rule.getUrlSetter());
                }
                break;
            case Enums_1.SaveTarget.RELAY:
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
                manager.handleSharedVar(responseArr[i], responseArr[i + 1]);
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
    handleSharedVar(name, value) {
        if (name.length == 0) {
            return;
        }
        let val = 0;
        let sharedVar = this.shared[name];
        if (sharedVar === undefined) {
            sharedVar = new SharedVariable_1.SharedVariable(name, val);
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
        for (let item of this.rules.concat(this.sensors, this.relays)) {
            this.dragAndDrop[item.id] = item;
        }
        this.attacher = new Attacher_1.Attacher(manager);
        //@ts-ignore
        manager.updateInterval = setInterval(manager.update, 1000);
    }
    getSensor(index) {
        if (index < this.bus_a.length) {
            return this.bus_a[index];
        }
        if ((index -= this.bus_a.length) < this.bus_b.length) {
            return this.bus_b[index];
        }
        return this.analog[index - this.bus_b.length];
    }
    getSensorRelativeIndex(sensor) {
        let index = this.bus_a.indexOf(sensor);
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
exports.Manager = Manager;


/***/ }),

/***/ "./src/Realtime.ts":
/*!*************************!*\
  !*** ./src/Realtime.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Realtime = void 0;
const Helper_1 = __webpack_require__(/*! ./Helper */ "./src/Helper.ts");
class Realtime {
    constructor(target) {
        Helper_1.addRelativeCallback(target, "update", this, (x) => x.updateHandler());
        this.id = Helper_1.uuidv4();
    }
    updateHandler() {
    }
}
exports.Realtime = Realtime;


/***/ }),

/***/ "./src/Relay.ts":
/*!**********************!*\
  !*** ./src/Relay.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Relay = void 0;
const Helper_1 = __webpack_require__(/*! ./Helper */ "./src/Helper.ts");
const Realtime_1 = __webpack_require__(/*! ./Realtime */ "./src/Realtime.ts");
class Relay extends Realtime_1.Realtime {
    constructor(nameVar, ruleIndexVar, stateVar, manager) {
        super(manager);
        this.nameVar = nameVar;
        this.ruleIndexVar = ruleIndexVar;
        this.stateVar = stateVar;
        this.manager = manager;
    }
    //#region rule
    get rule() {
        return this.manager.rules[this.ruleIndexVar.value];
    }
    set rule(rule) {
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
    get name() {
        return this.nameVar.value.toString();
    }
    set name(text) {
        this.nameVar.value = text;
    }
    get element() {
        return this._element;
    }
    set element(el) {
        this._element = el;
        this.element.id = this.id;
        this.ruleElement = this.element.getElementsByClassName("relay-rule")[1];
        this.nameElement = this.element.getElementsByClassName("relay-name")[1];
        this.element.getElementsByTagName("button")[0].addEventListener("click", () => this.rule = undefined);
        this.rule = this.rule;
        this.nameVar.bindText(this.nameElement);
        Helper_1.enableDrop(this.element);
    }
    getType() {
        return "relay";
    }
    handleDrop(obj, target) {
        if (obj.getType() != "rule") {
            return;
        }
        let rule = obj;
        this.rule = rule;
        console.log(this);
    }
    updateHandler() {
    }
    getUrlSetter() {
        return this.nameVar.getUrlSetter() + "&" + this.ruleIndexVar.getUrlSetter();
    }
    static CreateWithProperty(array, arrayIndex, propertyIndex, variable, manager) {
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
exports.Relay = Relay;


/***/ }),

/***/ "./src/Rule.ts":
/*!*********************!*\
  !*** ./src/Rule.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Rule = void 0;
const Enums_1 = __webpack_require__(/*! ./Enums */ "./src/Enums.ts");
const Helper_1 = __webpack_require__(/*! ./Helper */ "./src/Helper.ts");
const Realtime_1 = __webpack_require__(/*! ./Realtime */ "./src/Realtime.ts");
class Rule extends Realtime_1.Realtime {
    //#endregion
    constructor(nameVar, startVar, endVar, typeVar, targetVar, subRuleAVar, subRuleBVar, manager) {
        super(manager);
        this.nameVar = nameVar;
        this.startVar = startVar;
        this.endVar = endVar;
        this.typeVar = typeVar;
        this.targetVar = targetVar;
        this.subRuleAVar = subRuleAVar;
        this.subRuleBVar = subRuleBVar;
        this.manager = manager;
        this._prevType = 0;
    }
    //#region name
    get name() {
        return this.nameVar.value.toString();
    }
    set name(value) {
        this.nameVar.value = value;
    }
    //#endregion
    //#region start
    get start() {
        return this.startVar.value;
    }
    set start(s) {
        this.startVar.value = s;
    }
    //#endregion
    //#region end
    get end() {
        return this.endVar.value;
    }
    set end(s) {
        this.endVar.value = s;
    }
    //#endregion
    //#region type
    get type() {
        return this.typeVar.value;
    }
    set type(type) {
        this.typeVar.value = type;
    }
    //#endregion
    //#region target
    get target() {
        return this.manager.getSensor(this.targetVar.value);
    }
    set target(sensor) {
        let index = this.manager.getSensorRelativeIndex(sensor);
        if (index != -1) {
            this.targetVar.value = index;
        }
        if (this.sensorElement && sensor) {
            this.sensorElement.value = sensor.mainName;
        }
    }
    //#endregion
    //#region subRuleA
    get subRuleA() {
        return this.manager.rules[this.subRuleAVar.value];
    }
    set subRuleA(rule) {
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
    get subRuleB() {
        return this.manager.rules[this.subRuleBVar.value];
    }
    set subRuleB(rule) {
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
    getType() {
        return "rule";
    }
    handleDrop(obj, target) {
        switch (obj.getType()) {
            case "sensor":
                this.target = obj;
                break;
            case "rule":
                let aIndex = target.classList.contains("rule-a");
                let bIndex = target.classList.contains("rule-b");
                if (aIndex)
                    this.subRuleA = obj;
                if (bIndex)
                    this.subRuleB = obj;
                break;
            default:
                break;
        }
        console.log(this);
    }
    static CreateWithProperty(array, arrayIndex, propertyIndex, variable, manager) {
        let rule = array[arrayIndex];
        if (rule === undefined) {
            rule = array[arrayIndex] = new Rule(undefined, undefined, undefined, undefined, undefined, undefined, undefined, manager);
        }
        switch (propertyIndex % 7) {
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
            default:
                break;
        }
        return rule;
    }
    get element() {
        return this._element;
    }
    set element(el) {
        this._element = el;
        if (this.element === undefined) {
            return;
        }
        this.element.id = this.id;
        this.nameElement = this.element.getElementsByClassName("rule-name")[1];
        this.startElement = this.element.getElementsByClassName("rule-start")[1];
        this.endElement = this.element.getElementsByClassName("rule-end")[1];
        this.sensorElement = this.element.getElementsByClassName("rule-sensor")[1];
        this.sensorTypeElement = this.element.getElementsByClassName("rule-sensor-type")[1];
        this.subRuleAElement = this.element.getElementsByClassName("rule-a")[1];
        this.subRuleBElement = this.element.getElementsByClassName("rule-b")[1];
        this.subRuleAClearButton = this.element.getElementsByClassName("rule-a")[0].getElementsByTagName("button")[0];
        this.subRuleBClearButton = this.element.getElementsByClassName("rule-b")[0].getElementsByTagName("button")[0];
        this.subRuleAClearButton.addEventListener("click", () => this.subRuleA = undefined);
        this.subRuleBClearButton.addEventListener("click", () => this.subRuleB = undefined);
        this.typeVar.bindSelect(this.sensorTypeElement, () => { this.updateStyle(); });
        this.nameVar.bindText(this.nameElement);
        this.target = this.target;
        this.subRuleA = this.subRuleA;
        this.subRuleB = this.subRuleB;
        this.updateStyle();
        Helper_1.enableDrop(this.element);
        console.log(this);
    }
    updateHandler() { }
    updateStyle() {
        this.element.classList.remove(Enums_1.RuleType[this._prevType]);
        this.element.classList.add(Enums_1.RuleType[this.type]);
        this._prevType = this.type;
        switch (this.type) {
            case Enums_1.RuleType.BUS_MAIN:
            case Enums_1.RuleType.BUS_MISC:
            case Enums_1.RuleType.CPWM:
                this.startElement.type = "text";
                this.endElement.type = "text";
                this.startElement.value = this.start.toString();
                this.endElement.value = this.end.toString();
                break;
            case Enums_1.RuleType.TIME:
                this.startElement.type = "time";
                this.endElement.type = "time";
                this.startElement.value = Helper_1.secondsToDate(this.start);
                this.endElement.value = Helper_1.secondsToDate(this.end);
                break;
        }
    }
    getUrlSetter() {
        this.startVar.set(this.startElement.value, this.type);
        this.endVar.set(this.endElement.value, this.type);
        return (this.nameVar.getUrlSetter() +
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
            this.subRuleBVar.getUrlSetter());
    }
}
exports.Rule = Rule;


/***/ }),

/***/ "./src/Sensor.ts":
/*!***********************!*\
  !*** ./src/Sensor.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SensorType = exports.Sensor = void 0;
const Realtime_1 = __webpack_require__(/*! ./Realtime */ "./src/Realtime.ts");
class Sensor extends Realtime_1.Realtime {
    constructor(mainNameVar, miscNameVar, mainVar, miscVar, manager, type = SensorType.GENERAL) {
        super(manager);
        this.mainNameVar = mainNameVar;
        this.miscNameVar = miscNameVar;
        this.mainVar = mainVar;
        this.miscVar = miscVar;
        this.manager = manager;
        this.type = type;
    }
    //#region main
    get main() {
        return this.mainVar.value;
    }
    //#endregion
    //#region misc
    get misc() {
        return this.miscVar.value;
    }
    //#endregion
    //#region mainName
    get mainName() {
        return this.mainNameVar.value.toString();
    }
    set mainName(text) {
        this.mainNameVar.value = text;
    }
    get element() {
        return this._element;
    }
    set element(el) {
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
                    this.sensorName.value = this.mainNameVar._value.toString();
                    this.sensorName.setAttribute("readonly", "true");
                    break;
                default:
                    break;
            }
        }
    }
    getType() {
        return "sensor";
    }
    handleDrop(obj, target) {
        throw new Error("Method not implemented.");
    }
    static CreateWithProperty(array, arrayIndex, propertyIndex, variable, manager, type = SensorType.GENERAL) {
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
    getUrlSetter() {
        if (this.type == SensorType.ANALOG) {
            return "U99=0";
        }
        return this.mainNameVar.getUrlSetter();
    }
    updateHandler() {
        if (this.sensorMain && this.mainVar)
            this.sensorMain.innerHTML = this.main.toString();
        if (this.sensorMisc && this.miscVar)
            this.sensorMisc.innerHTML = this.misc.toString();
    }
}
exports.Sensor = Sensor;
var SensorType;
(function (SensorType) {
    SensorType[SensorType["GENERAL"] = 0] = "GENERAL";
    SensorType[SensorType["ANALOG"] = 1] = "ANALOG";
})(SensorType = exports.SensorType || (exports.SensorType = {}));


/***/ }),

/***/ "./src/SharedRange.ts":
/*!****************************!*\
  !*** ./src/SharedRange.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedRange = void 0;
class SharedRange {
    constructor(prefix, start, end, callback, onlyOnce = false) {
        this.prefix = prefix;
        this.start = start;
        this.end = end;
        this.callback = callback;
        this.onlyOnce = onlyOnce;
    }
    handleSharedVar(variable) {
        if (variable.name[0] == this.prefix && this.start <= variable.index && variable.index <= this.end) {
            variable.realTime = !this.onlyOnce;
            this.callback(variable, variable.index - this.start);
        }
    }
}
exports.SharedRange = SharedRange;


/***/ }),

/***/ "./src/SharedVariable.ts":
/*!*******************************!*\
  !*** ./src/SharedVariable.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedVariable = void 0;
const Enums_1 = __webpack_require__(/*! ./Enums */ "./src/Enums.ts");
const Helper_1 = __webpack_require__(/*! ./Helper */ "./src/Helper.ts");
class SharedVariable {
    constructor(name, value) {
        this.realTime = true;
        this.name = name;
        this.value = value;
        this.index = parseInt(name.slice(1));
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
        if (this._target !== undefined) {
            switch (this._type) {
                case BindType.Text:
                    this._target.value = val.toString();
                    break;
                case BindType.Select:
                    this._target.options.selectedIndex = val;
                    break;
                default:
                    break;
            }
        }
    }
    getUrlSetter() {
        return this.name + "=" + this.value;
    }
    set(val, type) {
        switch (type) {
            case Enums_1.RuleType.BUS_MAIN:
            case Enums_1.RuleType.BUS_MISC:
            case Enums_1.RuleType.CPWM:
                this._value = parseInt(val);
                break;
            case Enums_1.RuleType.TIME:
                this._value = Helper_1.dateToSeconds(val);
                break;
        }
    }
    bindText(target, action = null) {
        this._type = BindType.Text;
        this._target = target;
        Helper_1.addRelativeCallback(this._target, "change", this, (x) => {
            x._value = x._target.value;
            if (action) {
                action();
            }
            //TODO: remove debug
            console.log(x);
        });
        this.value = this.value;
    }
    bindSelect(target, action = null) {
        this._type = BindType.Select;
        this._target = target;
        Helper_1.addRelativeCallback(this._target, "change", this, (x) => {
            x._value = x._target.options.selectedIndex;
            if (action) {
                action();
            }
            //TODO: remove debug
            console.log(x);
        });
        this.value = this.value;
    }
}
exports.SharedVariable = SharedVariable;
var BindType;
(function (BindType) {
    BindType[BindType["Text"] = 0] = "Text";
    BindType[BindType["Select"] = 1] = "Select";
})(BindType || (BindType = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Manager_1 = __webpack_require__(/*! ./Manager */ "./src/Manager.ts");
const manager = new Manager_1.Manager();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQzovVXNlcnMvbHVrYXMvc291cmNlL3JlcG9zL2NoYWxvdXBrYV96YXZsYXpvdmFuaS9zcmMvQXR0YWNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0M6L1VzZXJzL2x1a2FzL3NvdXJjZS9yZXBvcy9jaGFsb3Vwa2FfemF2bGF6b3Zhbmkvc3JjL0VudW1zLnRzIiwid2VicGFjazovLy8uL3NyYy9DOi9Vc2Vycy9sdWthcy9zb3VyY2UvcmVwb3MvY2hhbG91cGthX3phdmxhem92YW5pL3NyYy9IZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0M6L1VzZXJzL2x1a2FzL3NvdXJjZS9yZXBvcy9jaGFsb3Vwa2FfemF2bGF6b3Zhbmkvc3JjL01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0M6L1VzZXJzL2x1a2FzL3NvdXJjZS9yZXBvcy9jaGFsb3Vwa2FfemF2bGF6b3Zhbmkvc3JjL1JlYWx0aW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9DOi9Vc2Vycy9sdWthcy9zb3VyY2UvcmVwb3MvY2hhbG91cGthX3phdmxhem92YW5pL3NyYy9SZWxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQzovVXNlcnMvbHVrYXMvc291cmNlL3JlcG9zL2NoYWxvdXBrYV96YXZsYXpvdmFuaS9zcmMvUnVsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQzovVXNlcnMvbHVrYXMvc291cmNlL3JlcG9zL2NoYWxvdXBrYV96YXZsYXpvdmFuaS9zcmMvU2Vuc29yLnRzIiwid2VicGFjazovLy8uL3NyYy9DOi9Vc2Vycy9sdWthcy9zb3VyY2UvcmVwb3MvY2hhbG91cGthX3phdmxhem92YW5pL3NyYy9TaGFyZWRSYW5nZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQzovVXNlcnMvbHVrYXMvc291cmNlL3JlcG9zL2NoYWxvdXBrYV96YXZsYXpvdmFuaS9zcmMvU2hhcmVkVmFyaWFibGUudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9DOi9Vc2Vycy9sdWthcy9zb3VyY2UvcmVwb3MvY2hhbG91cGthX3phdmxhem92YW5pL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFhLFFBQVE7SUFZakIsWUFBbUIsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQVRuQyxrQkFBYSxHQUFXLE1BQU0sQ0FBQztRQUkvQixvQkFBZSxHQUFXLFFBQVEsQ0FBQztRQUluQyxtQkFBYyxHQUFXLE9BQU8sQ0FBQztRQUU3QixJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQztRQUNyRCxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUM7UUFDekQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXRELElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVwRCxLQUFLLE1BQU0sSUFBSSxJQUFJLE9B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QUFDLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLDRCQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3ZELENBQUMsQ0FBQyxNQUFNLEdBQXVCLENBQUMsQ0FBQyxPQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUNoRSxJQUFJLE1BQU0sRUFBRTtnQkFDWCxNQUFNLEVBQUUsQ0FBQzthQUNUO1lBQ0Qsb0JBQW9CO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDekIsQ0FBQztDQUNEO0FBdkVELHdDQXVFQztBQUVELElBQUssUUFHSjtBQUhELFdBQUssUUFBUTtJQUNaLHVDQUFJO0lBQ0osMkNBQU07QUFDUCxDQUFDLEVBSEksUUFBUSxLQUFSLFFBQVEsUUFHWjs7Ozs7OztVQ2hGRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7Ozs7QUN0QkEsMkVBQW1DO0FBRW5DLE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDIiwiZmlsZSI6Imh5ZHJvLWJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9NYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQXR0YWNoZXIge1xyXG4gICAgcnVsZUNvbnRhaW5lcjogRWxlbWVudDtcclxuICAgIHJ1bGVUZW1wbGF0ZTogRWxlbWVudDtcclxuICAgIHJ1bGVDbGFzc05hbWU6IHN0cmluZyA9IFwicnVsZVwiO1xyXG5cclxuICAgIHNlbnNvckNvbnRhaW5lcjogRWxlbWVudDtcclxuICAgIHNlbnNvclRlbXBsYXRlOiBFbGVtZW50O1xyXG4gICAgc2Vuc29yQ2xhc3NOYW1lOiBzdHJpbmcgPSBcInNlbnNvclwiO1xyXG5cclxuICAgIHJlbGF5Q29udGFpbmVyOiBFbGVtZW50O1xyXG4gICAgcmVsYXlUZW1wbGF0ZTogRWxlbWVudDtcclxuICAgIHJlbGF5Q2xhc3NOYW1lOiBzdHJpbmcgPSBcInJlbGF5XCI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWFuYWdlcjogTWFuYWdlcikge1xyXG4gICAgICAgIHRoaXMucnVsZVRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnJ1bGVDbGFzc05hbWUpWzBdO1xyXG4gICAgICAgIHRoaXMucnVsZUNvbnRhaW5lciA9IHRoaXMucnVsZVRlbXBsYXRlLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5ydWxlQ29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMucnVsZVRlbXBsYXRlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZW5zb3JUZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5zZW5zb3JDbGFzc05hbWUpWzBdO1xyXG4gICAgICAgIHRoaXMuc2Vuc29yQ29udGFpbmVyID0gdGhpcy5zZW5zb3JUZW1wbGF0ZS5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIHRoaXMuc2Vuc29yQ29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMuc2Vuc29yVGVtcGxhdGUpO1xyXG5cclxuICAgICAgICB0aGlzLnJlbGF5VGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMucmVsYXlDbGFzc05hbWUpWzBdO1xyXG4gICAgICAgIHRoaXMucmVsYXlDb250YWluZXIgPSB0aGlzLnJlbGF5VGVtcGxhdGUucGFyZW50RWxlbWVudDtcclxuICAgICAgICB0aGlzLnJlbGF5Q29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMucmVsYXlUZW1wbGF0ZSk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgcnVsZSBvZiBtYW5hZ2VyLnJ1bGVzKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBOb2RlID0gdGhpcy5ydWxlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnJ1bGVDb250YWluZXIuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICAgIHJ1bGUuZWxlbWVudCA9IHRoaXMucnVsZUNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMucnVsZUNsYXNzTmFtZSlbdGhpcy5ydWxlQ29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50IC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoY29uc3Qgc2Vuc29yIG9mIG1hbmFnZXIuc2Vuc29ycykge1xyXG4gICAgICAgICAgICBsZXQgbm9kZTogTm9kZSA9IHRoaXMuc2Vuc29yVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbnNvckNvbnRhaW5lci5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgICAgICAgICAgc2Vuc29yLmVsZW1lbnQgPSB0aGlzLnNlbnNvckNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMuc2Vuc29yQ2xhc3NOYW1lKVt0aGlzLnNlbnNvckNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudCAtIDFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IHJlbGF5IG9mIG1hbmFnZXIucmVsYXlzKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBOb2RlID0gdGhpcy5yZWxheVRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5yZWxheUNvbnRhaW5lci5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgICAgICAgICAgcmVsYXkuZWxlbWVudCA9IHRoaXMucmVsYXlDb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnJlbGF5Q2xhc3NOYW1lKVt0aGlzLnJlbGF5Q29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50IC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gUnVsZVR5cGUge1xyXG4gICAgTk9ORSA9IDAsXHJcbiAgICBUSU1FID0gMSxcclxuICAgIEJVU19NQUlOID0gMixcclxuICAgIEJVU19NSVNDID0gMyxcclxuICAgIENQV00gPSA0LFxyXG5cclxuICAgIHJ1bGVfbm9uZSA9IDAsXHJcbiAgICBydWxlX3RpbWUgPSAxLFxyXG4gICAgcnVsZV90ZW1wID0gMixcclxuICAgIHJ1bGVfaHVtaSA9IDMsXHJcbiAgICBydWxlX2Nwd20gPSA0LFxyXG5cclxufVxyXG5leHBvcnQgZW51bSBSZWxheUluZGV4ZXMge1xyXG4gICAgVEVYVCA9IDAsXHJcbiAgICBSVUxFID0gMSxcclxuICAgIFNUQVRFID0gMixcclxufVxyXG5cclxuZXhwb3J0IGVudW0gU2F2ZVRhcmdldCB7XHJcbiAgICBBTEwgPSAwLFxyXG4gICAgU0VOU09SID0gMSxcclxuICAgIFJVTEUgPSAyLFxyXG4gICAgUkVMQVkgPSAzLFxyXG59IiwiZXhwb3J0IGZ1bmN0aW9uIHBhZChudW06IHN0cmluZyB8IG51bWJlciwgc2l6ZTogbnVtYmVyKSB7XHJcbiAgICBudW0gPSBudW0udG9TdHJpbmcoKTtcclxuICAgIHdoaWxlIChudW0ubGVuZ3RoIDwgc2l6ZSkgbnVtID0gXCIwXCIgKyBudW07XHJcbiAgICByZXR1cm4gbnVtO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkUmVsYXRpdmVDYWxsYmFjazxUPih0YXJnZXQ6IEV2ZW50VGFyZ2V0LCBldmVudDogc3RyaW5nLCBvYmo6IFQsIGNhbGxiYWNrOiAob2JqOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAoZnVuY3Rpb24gKHM6IFQsIG06IEV2ZW50VGFyZ2V0LCBjYWxsOiBGdW5jdGlvbikge1xyXG4gICAgICAgIG0uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgKCkgPT4gY2FsbGJhY2socyksIGZhbHNlKTtcclxuICAgIH0pKG9iaiwgdGFyZ2V0LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEcmFnVGFyZ2V0KGVsZW1lbnQ6IEVsZW1lbnQpIHtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHV1aWR2NCgpOiBzdHJpbmcge1xyXG4gICAgLy9AdHMtaWdub3JlXHJcbiAgICByZXR1cm4gKFsxZTddICsgLTFlMyArIC00ZTMgKyAtOGUzICsgLTFlMTEpLnJlcGxhY2UoL1swMThdL2csIGMgPT5cclxuICAgICAgICAoYyBeIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoMSkpWzBdICYgMTUgPj4gYyAvIDQpLnRvU3RyaW5nKDE2KVxyXG4gICAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlY29uZHNUb0RhdGUoc2Vjb25kczogbnVtYmVyKSB7XHJcbiAgICBsZXQgaCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xyXG4gICAgc2Vjb25kcyAlPSAzNjAwO1xyXG4gICAgbGV0IG0gPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XHJcbiAgICBzZWNvbmRzICU9IDYwO1xyXG4gICAgcmV0dXJuIHBhZChoLCAyKSArIFwiOlwiICsgcGFkKG0sIDIpICsgXCI6XCIgKyBwYWQoc2Vjb25kcywgMik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlVG9TZWNvbmRzKGRhdGU6IHN0cmluZykge1xyXG4gICAgbGV0IGFyciA9IGRhdGUuc3BsaXQoXCI6XCIpO1xyXG5cclxuICAgIGxldCBzdW0gPSAwO1xyXG4gICAgaWYgKGFyclswXSkge1xyXG4gICAgICAgIHN1bSArPSBwYXJzZUludChhcnJbMF0pICogMzYwMFxyXG4gICAgfVxyXG4gICAgaWYgKGFyclsxXSkge1xyXG4gICAgICAgIHN1bSArPSBwYXJzZUludChhcnJbMV0pICogNjBcclxuICAgIH1cclxuICAgIGlmIChhcnJbMl0pIHtcclxuICAgICAgICBzdW0gKz0gcGFyc2VJbnQoYXJyWzJdKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdW07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVEcm9wKHRhcmdldDogRWxlbWVudCkge1xyXG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCB4ID0+IHtcclxuICAgICAgICB4LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgeC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0pXHJcbn0iLCJpbXBvcnQgeyBBdHRhY2hlciB9IGZyb20gXCIuL0F0dGFjaGVyXCI7XHJcbmltcG9ydCB7IFJlbGF5SW5kZXhlcywgUnVsZVR5cGUsIFNhdmVUYXJnZXQgfSBmcm9tIFwiLi9FbnVtc1wiO1xyXG5pbXBvcnQgeyBJRHJhZ0FuZERyb3AgfSBmcm9tIFwiLi9JRHJhZ0FuZERyb3BcIjtcclxuaW1wb3J0IHsgSVNhdmVhYmxlIH0gZnJvbSBcIi4vSVNhdmVhYmxlXCI7XHJcbmltcG9ydCB7IFJlbGF5IH0gZnJvbSBcIi4vUmVsYXlcIjtcclxuaW1wb3J0IHsgUnVsZSB9IGZyb20gXCIuL1J1bGVcIjtcclxuaW1wb3J0IHsgU2Vuc29yLCBTZW5zb3JUeXBlIH0gZnJvbSBcIi4vU2Vuc29yXCI7XHJcbmltcG9ydCB7IFNoYXJlZFJhbmdlIH0gZnJvbSBcIi4vU2hhcmVkUmFuZ2VcIjtcclxuaW1wb3J0IHsgU2hhcmVkVmFyaWFibGUgfSBmcm9tIFwiLi9TaGFyZWRWYXJpYWJsZVwiO1xyXG5cclxudmFyIG1hbmFnZXI6IE1hbmFnZXI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWFuYWdlciBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcclxuICAgIHNoYXJlZFJhbmdlczogU2hhcmVkUmFuZ2VbXSA9IFtcclxuICAgICAgICBuZXcgU2hhcmVkUmFuZ2UoXCJUXCIsIDEsIDQsICh2YXJpYWJsZTogU2hhcmVkVmFyaWFibGUsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5idXNfYV9uYW1lc1tpbmRleF0gPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgU2Vuc29yLkNyZWF0ZVdpdGhQcm9wZXJ0eSh0aGlzLmJ1c19hLCBpbmRleCwgMCwgdmFyaWFibGUsIG1hbmFnZXIpO1xyXG4gICAgICAgIH0sIHRydWUpLFxyXG4gICAgICAgIG5ldyBTaGFyZWRSYW5nZShcIlRcIiwgMTEsIDE0LCAodmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVzX2JfbmFtZXNbaW5kZXhdID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgIFNlbnNvci5DcmVhdGVXaXRoUHJvcGVydHkodGhpcy5idXNfYiwgaW5kZXgsIDAsIHZhcmlhYmxlLCBtYW5hZ2VyKTtcclxuICAgICAgICB9LCB0cnVlKSxcclxuICAgICAgICBuZXcgU2hhcmVkUmFuZ2UoXCJUXCIsIDIxLCAzMCwgKHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJ1bGVfbmFtZXNbaW5kZXhdID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgIFJ1bGUuQ3JlYXRlV2l0aFByb3BlcnR5KG1hbmFnZXIucnVsZXMsIGluZGV4LCA2LCB2YXJpYWJsZSwgbWFuYWdlcik7XHJcbiAgICAgICAgfSwgdHJ1ZSksXHJcbiAgICAgICAgbmV3IFNoYXJlZFJhbmdlKFwiVFwiLCAzMSwgMzYsICh2YXJpYWJsZTogU2hhcmVkVmFyaWFibGUsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZWxheV9uYW1lc1tpbmRleF0gPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgUmVsYXkuQ3JlYXRlV2l0aFByb3BlcnR5KG1hbmFnZXIucmVsYXlzLCBpbmRleCwgUmVsYXlJbmRleGVzLlRFWFQsIHZhcmlhYmxlLCBtYW5hZ2VyKTtcclxuICAgICAgICB9LCB0cnVlKSxcclxuICAgICAgICBuZXcgU2hhcmVkUmFuZ2UoXCJUXCIsIDQxLCA0OCwgKHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFuYWxvZ19uYW1lc1tpbmRleF0gPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgU2Vuc29yLkNyZWF0ZVdpdGhQcm9wZXJ0eSh0aGlzLmFuYWxvZywgaW5kZXgsIDAsIHZhcmlhYmxlLCBtYW5hZ2VyLCBTZW5zb3JUeXBlLkFOQUxPRyk7XHJcbiAgICAgICAgfSwgdHJ1ZSksXHJcblxyXG4gICAgICAgIG5ldyBTaGFyZWRSYW5nZShcIlVcIiwgMTAsIDEwLCAodmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZVZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIG5ldyBTaGFyZWRSYW5nZShcIlVcIiwgMTEsIDE2LCAodmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVsYXlfc3RhdGVzW2luZGV4XSA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICBSZWxheS5DcmVhdGVXaXRoUHJvcGVydHkobWFuYWdlci5yZWxheXMsIGluZGV4LCBSZWxheUluZGV4ZXMuU1RBVEUsIHZhcmlhYmxlLCBtYW5hZ2VyKTtcclxuICAgICAgICB9KSxcclxuICAgICAgICBuZXcgU2hhcmVkUmFuZ2UoXCJVXCIsIDIxLCA2MCwgKHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJ1bGVfaW5mb19yYXdbaW5kZXhdID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgIFJ1bGUuQ3JlYXRlV2l0aFByb3BlcnR5KG1hbmFnZXIucnVsZXMsIE1hdGguZmxvb3IoaW5kZXggLyA0KSwgKGluZGV4ICUgNCkgKyAyLCB2YXJpYWJsZSwgbWFuYWdlcik7XHJcbiAgICAgICAgfSwgdHJ1ZSksXHJcbiAgICAgICAgbmV3IFNoYXJlZFJhbmdlKFwiVVwiLCA3MCwgNzUsICh2YXJpYWJsZTogU2hhcmVkVmFyaWFibGUsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZWxheV9ydWxlX2luZGV4W2luZGV4XSA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICBSZWxheS5DcmVhdGVXaXRoUHJvcGVydHkobWFuYWdlci5yZWxheXMsIGluZGV4LCBSZWxheUluZGV4ZXMuUlVMRSwgdmFyaWFibGUsIG1hbmFnZXIpO1xyXG4gICAgICAgIH0sIHRydWUpLFxyXG5cclxuICAgICAgICBuZXcgU2hhcmVkUmFuZ2UoXCJTXCIsIDExLCAxOCwgKHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmJ1c19hX3Jhd1tpbmRleF0gPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgU2Vuc29yLkNyZWF0ZVdpdGhQcm9wZXJ0eSh0aGlzLmJ1c19hLCBNYXRoLmZsb29yKGluZGV4IC8gMiksIChpbmRleCAlIDIpICsgMSwgdmFyaWFibGUsIG1hbmFnZXIpO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIG5ldyBTaGFyZWRSYW5nZShcIlNcIiwgMjEsIDI4LCAodmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVzX2JfcmF3W2luZGV4XSA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICBTZW5zb3IuQ3JlYXRlV2l0aFByb3BlcnR5KHRoaXMuYnVzX2IsIE1hdGguZmxvb3IoaW5kZXggLyAyKSwgKGluZGV4ICUgMikgKyAxLCB2YXJpYWJsZSwgbWFuYWdlcik7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgbmV3IFNoYXJlZFJhbmdlKFwiU1wiLCAzMSwgNTAsICh2YXJpYWJsZTogU2hhcmVkVmFyaWFibGUsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ydWxlX3JhbmdlX3Jhd1tpbmRleF0gPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgUnVsZS5DcmVhdGVXaXRoUHJvcGVydHkobWFuYWdlci5ydWxlcywgTWF0aC5mbG9vcihpbmRleCAvIDIpLCAoaW5kZXggJSAyKSwgdmFyaWFibGUsIG1hbmFnZXIpO1xyXG4gICAgICAgIH0sIHRydWUpLFxyXG4gICAgICAgIG5ldyBTaGFyZWRSYW5nZShcIlNcIiwgNjAsIDc1LCAodmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5hbG9nX3Jhd1tpbmRleF0gPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgU2Vuc29yLkNyZWF0ZVdpdGhQcm9wZXJ0eSh0aGlzLmFuYWxvZywgTWF0aC5mbG9vcihpbmRleCAvIDIpLCAoaW5kZXggJSAyKSArIDEsIHZhcmlhYmxlLCBtYW5hZ2VyLCBTZW5zb3JUeXBlLkFOQUxPRyk7XHJcbiAgICAgICAgfSksXHJcbiAgICBdO1xyXG4gICAgdXBkYXRlSW50ZXJ2YWw6IG51bWJlcjtcclxuICAgIGF0dGFjaGVyOiBBdHRhY2hlcjtcclxuXHJcbiAgICBsb2FkZWQgPSBmYWxzZTtcclxuICAgIGZpcnN0VXBkYXRlRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJmaXJzdFVwZGF0ZVwiKTtcclxuICAgIHVwZGF0ZUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwidXBkYXRlXCIpO1xyXG5cclxuXHJcblxyXG4gICAgc2hhcmVkOiB7IFtpZDogc3RyaW5nXTogU2hhcmVkVmFyaWFibGUgfSA9IHt9O1xyXG5cclxuICAgIHRpbWVWYXI6IFNoYXJlZFZhcmlhYmxlO1xyXG5cclxuICAgIHNlbnNvcnM6IFNlbnNvcltdID0gW107XHJcblxyXG4gICAgYnVzX2E6IFNlbnNvcltdID0gW107XHJcbiAgICBidXNfYV9yYXc6IFNoYXJlZFZhcmlhYmxlW10gPSBbXTtcclxuICAgIGJ1c19hX25hbWVzOiBTaGFyZWRWYXJpYWJsZVtdID0gW107XHJcbiAgICBidXNfYjogU2Vuc29yW10gPSBbXTtcclxuICAgIGJ1c19iX3JhdzogU2hhcmVkVmFyaWFibGVbXSA9IFtdO1xyXG4gICAgYnVzX2JfbmFtZXM6IFNoYXJlZFZhcmlhYmxlW10gPSBbXTtcclxuXHJcbiAgICBydWxlczogUnVsZVtdID0gW107XHJcbiAgICBydWxlX3JhbmdlX3JhdzogU2hhcmVkVmFyaWFibGVbXSA9IFtdO1xyXG4gICAgcnVsZV9pbmZvX3JhdzogU2hhcmVkVmFyaWFibGVbXSA9IFtdO1xyXG4gICAgcnVsZV9uYW1lczogU2hhcmVkVmFyaWFibGVbXSA9IFtdO1xyXG5cclxuICAgIHJlbGF5czogUmVsYXlbXSA9IFtdO1xyXG4gICAgcmVsYXlfc3RhdGVzOiBTaGFyZWRWYXJpYWJsZVtdID0gW107XHJcbiAgICByZWxheV9ydWxlX2luZGV4OiBTaGFyZWRWYXJpYWJsZVtdID0gW107XHJcbiAgICByZWxheV9uYW1lczogU2hhcmVkVmFyaWFibGVbXSA9IFtdO1xyXG5cclxuICAgIGFuYWxvZ19uYW1lczogU2hhcmVkVmFyaWFibGVbXSA9IFtdO1xyXG4gICAgYW5hbG9nX3JhdzogU2hhcmVkVmFyaWFibGVbXSA9IFtdO1xyXG4gICAgYW5hbG9nOiBTZW5zb3JbXSA9IFtdO1xyXG5cclxuICAgIGRyYWdBbmREcm9wOiB7IFtpZDogc3RyaW5nXTogSURyYWdBbmREcm9wIH0gPSB7fTtcclxuXHJcbiAgICBsYXN0RHJhZ0NsYXNzID0gXCJcIjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIG1hbmFnZXIgPSB0aGlzO1xyXG4gICAgICAgICh3aW5kb3cgYXMgYW55KS5tYW5hZ2VyID0gdGhpcztcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaWQgPSAoPEVsZW1lbnQ+ZS50YXJnZXQpLmlkO1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9IFwidGV4dC9cIiArIHRoaXMuZHJhZ0FuZERyb3BbaWRdLmdldFR5cGUoKTtcclxuICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuaXRlbXMuYWRkKGlkLCB0eXBlKTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0RHJhZ0NsYXNzID0gXCJkcmFnLVwiICsgdGhpcy5kcmFnQW5kRHJvcFtpZF0uZ2V0VHlwZSgpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0uY2xhc3NMaXN0LmFkZCh0aGlzLmxhc3REcmFnQ2xhc3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gKDxFbGVtZW50PmUudGFyZ2V0KTtcclxuICAgICAgICAgICAgbGV0IHRhcmdldElkID0gZWxlbWVudC5pZDtcclxuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQgJiYgIXRhcmdldElkKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSBlbGVtZW50LmlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gZS5kYXRhVHJhbnNmZXIuaXRlbXNbMF07XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSA8RWxlbWVudD5lLnRhcmdldDtcclxuICAgICAgICAgICAgaXRlbS5nZXRBc1N0cmluZygob3JpZ2luSWQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ0FuZERyb3BbdGFyZ2V0SWRdLmhhbmRsZURyb3AodGhpcy5kcmFnQW5kRHJvcFtvcmlnaW5JZF0sIHRhcmdldCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbmRcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5sYXN0RHJhZ0NsYXNzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwiZmlyc3RVcGRhdGVcIiwgdGhpcy5maXJzdFVwZGF0ZUhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZFNoYXJlZFdyaXRlUmVxdWVzdChkYXRhOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxLm9wZW4oXCJHRVRcIiwgXCJodHRwOi8vMTkyLjE2OC4xLjEzMy9zdj9cIiArIGRhdGEpO1xyXG4gICAgICAgIHJlcS5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZSh0YXJnZXQ6IFNhdmVUYXJnZXQgPSBTYXZlVGFyZ2V0LkFMTCkge1xyXG4gICAgICAgIHN3aXRjaCAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNhc2UgU2F2ZVRhcmdldC5BTEw6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmUoU2F2ZVRhcmdldC5TRU5TT1IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlKFNhdmVUYXJnZXQuUlVMRSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmUoU2F2ZVRhcmdldC5SRUxBWSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgU2F2ZVRhcmdldC5TRU5TT1I6XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHNlbnNvciBvZiB0aGlzLnNlbnNvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTaGFyZWRXcml0ZVJlcXVlc3Qoc2Vuc29yLmdldFVybFNldHRlcigpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFNhdmVUYXJnZXQuUlVMRTpcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcnVsZSBvZiB0aGlzLnJ1bGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU2hhcmVkV3JpdGVSZXF1ZXN0KHJ1bGUuZ2V0VXJsU2V0dGVyKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgU2F2ZVRhcmdldC5SRUxBWTpcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcmVsYXkgb2YgdGhpcy5yZWxheXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTaGFyZWRXcml0ZVJlcXVlc3QocmVsYXkuZ2V0VXJsU2V0dGVyKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3BvbnNlQXJyID0gcmVxLnJlc3BvbnNlVGV4dC5zcGxpdChcInxcIik7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzcG9uc2VBcnIubGVuZ3RoOyBpICs9IDIpIHtcclxuICAgICAgICAgICAgICAgIG1hbmFnZXIuaGFuZGxlU2hhcmVkVmFyKHJlc3BvbnNlQXJyW2ldLCByZXNwb25zZUFycltpICsgMV0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbWFuYWdlci5sb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIG1hbmFnZXIuZGlzcGF0Y2hFdmVudChtYW5hZ2VyLmZpcnN0VXBkYXRlRXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgbWFuYWdlci5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWFuYWdlci5kaXNwYXRjaEV2ZW50KG1hbmFnZXIudXBkYXRlRXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXEub3BlbihcIkdFVFwiLCBcImh0dHA6Ly8xOTIuMTY4LjEuMTMzL3NoYXJlZC50eHRcIik7XHJcbiAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgIHJlcS5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU2hhcmVkVmFyKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmIChuYW1lLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHZhbDogc3RyaW5nIHwgbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgc2hhcmVkVmFyID0gdGhpcy5zaGFyZWRbbmFtZV07XHJcbiAgICAgICAgaWYgKHNoYXJlZFZhciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNoYXJlZFZhciA9IG5ldyBTaGFyZWRWYXJpYWJsZShuYW1lLCB2YWwpO1xyXG4gICAgICAgICAgICB0aGlzLnNoYXJlZFtuYW1lXSA9IHNoYXJlZFZhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzaGFyZWRWYXIucmVhbFRpbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKG5hbWVbMF0pIHtcclxuICAgICAgICAgICAgY2FzZSBcImVcIjpcclxuICAgICAgICAgICAgY2FzZSBcInVcIjpcclxuICAgICAgICAgICAgY2FzZSBcIlNcIjpcclxuICAgICAgICAgICAgY2FzZSBcIlVcIjpcclxuICAgICAgICAgICAgICAgIHZhbCA9IHBhcnNlSW50KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVFwiOlxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdmFsID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhcmVkVmFyLnZhbHVlID0gdmFsO1xyXG4gICAgICAgIHJldHVybiBzaGFyZWRWYXI7XHJcbiAgICB9XHJcblxyXG4gICAgZmlyc3RVcGRhdGVIYW5kbGVyKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuc2hhcmVkKSB7XHJcbiAgICAgICAgICAgIGxldCB2YXJpYWJsZSA9IHRoaXMuc2hhcmVkW2tleV07XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmFuZ2Ugb2YgdGhpcy5zaGFyZWRSYW5nZXMpIHtcclxuICAgICAgICAgICAgICAgIHJhbmdlLmhhbmRsZVNoYXJlZFZhcih2YXJpYWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2Vuc29ycyA9IHRoaXMuc2Vuc29ycy5jb25jYXQodGhpcy5idXNfYSwgdGhpcy5idXNfYiwgdGhpcy5hbmFsb2cpO1xyXG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgKDxJRHJhZ0FuZERyb3BbXT50aGlzLnJ1bGVzKS5jb25jYXQodGhpcy5zZW5zb3JzLCB0aGlzLnJlbGF5cykpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmFnQW5kRHJvcFtpdGVtLmlkXSA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmF0dGFjaGVyID0gbmV3IEF0dGFjaGVyKG1hbmFnZXIpO1xyXG5cclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBtYW5hZ2VyLnVwZGF0ZUludGVydmFsID0gc2V0SW50ZXJ2YWwobWFuYWdlci51cGRhdGUsIDEwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNlbnNvcihpbmRleDogbnVtYmVyKTogU2Vuc29yIHtcclxuICAgICAgICBpZiAoaW5kZXggPCB0aGlzLmJ1c19hLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5idXNfYVtpbmRleF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgoaW5kZXggLT0gdGhpcy5idXNfYS5sZW5ndGgpIDwgdGhpcy5idXNfYi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVzX2JbaW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5hbmFsb2dbaW5kZXggLSB0aGlzLmJ1c19iLmxlbmd0aF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2Vuc29yUmVsYXRpdmVJbmRleChzZW5zb3I6IFNlbnNvcik6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmJ1c19hLmluZGV4T2Yoc2Vuc29yKTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5idXNfYi5pbmRleE9mKHNlbnNvcik7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSB0aGlzLmFuYWxvZy5pbmRleE9mKHNlbnNvcikgKyB0aGlzLmJ1c19hLmxlbmd0aCArIHRoaXMuYnVzX2IubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gdGhpcy5idXNfYS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBhZGRSZWxhdGl2ZUNhbGxiYWNrLCB1dWlkdjQgfSBmcm9tIFwiLi9IZWxwZXJcIjtcclxuaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL01hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWFsdGltZSB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IodGFyZ2V0OiBFdmVudFRhcmdldCkge1xyXG4gICAgICAgIGFkZFJlbGF0aXZlQ2FsbGJhY2sodGFyZ2V0LCBcInVwZGF0ZVwiLCB0aGlzLCAoeCkgPT4geC51cGRhdGVIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaWQgPSB1dWlkdjQoKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBlbmFibGVEcm9wIH0gZnJvbSBcIi4vSGVscGVyXCI7XHJcbmltcG9ydCB7IElEcmFnQW5kRHJvcCB9IGZyb20gXCIuL0lEcmFnQW5kRHJvcFwiO1xyXG5pbXBvcnQgeyBJU2F2ZWFibGUgfSBmcm9tIFwiLi9JU2F2ZWFibGVcIjtcclxuaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL01hbmFnZXJcIjtcclxuaW1wb3J0IHsgUmVhbHRpbWUgfSBmcm9tIFwiLi9SZWFsdGltZVwiO1xyXG5pbXBvcnQgeyBSdWxlIH0gZnJvbSBcIi4vUnVsZVwiO1xyXG5pbXBvcnQgeyBTaGFyZWRWYXJpYWJsZSB9IGZyb20gXCIuL1NoYXJlZFZhcmlhYmxlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVsYXkgZXh0ZW5kcyBSZWFsdGltZSBpbXBsZW1lbnRzIElTYXZlYWJsZSwgSURyYWdBbmREcm9wIHtcclxuICAgIC8vI3JlZ2lvbiBydWxlXHJcbiAgICBnZXQgcnVsZSgpOiBSdWxlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLnJ1bGVzWzxudW1iZXI+dGhpcy5ydWxlSW5kZXhWYXIudmFsdWVdO1xyXG4gICAgfVxyXG4gICAgc2V0IHJ1bGUocnVsZTogUnVsZSkge1xyXG4gICAgICAgIHRoaXMucnVsZUluZGV4VmFyLnZhbHVlID0gdGhpcy5tYW5hZ2VyLnJ1bGVzLmluZGV4T2YocnVsZSk7XHJcbiAgICAgICAgaWYgKHRoaXMucnVsZUluZGV4VmFyLnZhbHVlID09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMucnVsZUluZGV4VmFyLnZhbHVlID0gMHg3RkZGRkZGRjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucnVsZUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucnVsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ydWxlRWxlbWVudC52YWx1ZSA9IHJ1bGUubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucnVsZUVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIG5hbWVcclxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZVZhci52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgc2V0IG5hbWUodGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lVmFyLnZhbHVlID0gdGV4dDtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIG5hbWVFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcnVsZUVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBfZWxlbWVudDogRWxlbWVudDtcclxuICAgIGdldCBlbGVtZW50KCk6IEVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xyXG4gICAgfVxyXG4gICAgc2V0IGVsZW1lbnQoZWw6IEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWw7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmlkID0gdGhpcy5pZDtcclxuXHJcbiAgICAgICAgdGhpcy5ydWxlRWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicmVsYXktcnVsZVwiKVsxXTtcclxuICAgICAgICB0aGlzLm5hbWVFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJyZWxheS1uYW1lXCIpWzFdO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJidXR0b25cIilbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMucnVsZSA9IHVuZGVmaW5lZCk7XHJcblxyXG4gICAgICAgIHRoaXMucnVsZSA9IHRoaXMucnVsZTtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lVmFyLmJpbmRUZXh0KHRoaXMubmFtZUVsZW1lbnQpO1xyXG5cclxuICAgICAgICBlbmFibGVEcm9wKHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWVWYXI6IFNoYXJlZFZhcmlhYmxlLCBwdWJsaWMgcnVsZUluZGV4VmFyOiBTaGFyZWRWYXJpYWJsZSwgcHVibGljIHN0YXRlVmFyOiBTaGFyZWRWYXJpYWJsZSwgcHVibGljIG1hbmFnZXI6IE1hbmFnZXIpIHtcclxuICAgICAgICBzdXBlcihtYW5hZ2VyKTtcclxuICAgIH1cclxuICAgIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJyZWxheVwiO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlRHJvcChvYmo6IElEcmFnQW5kRHJvcCwgdGFyZ2V0OiBFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKG9iai5nZXRUeXBlKCkgIT0gXCJydWxlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcnVsZTogUnVsZSA9IDxSdWxlPm9iajtcclxuICAgICAgICB0aGlzLnJ1bGUgPSBydWxlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlSGFuZGxlcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXJsU2V0dGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZVZhci5nZXRVcmxTZXR0ZXIoKSArIFwiJlwiICsgdGhpcy5ydWxlSW5kZXhWYXIuZ2V0VXJsU2V0dGVyKCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgQ3JlYXRlV2l0aFByb3BlcnR5KGFycmF5OiBSZWxheVtdLCBhcnJheUluZGV4OiBudW1iZXIsIHByb3BlcnR5SW5kZXg6IG51bWJlciwgdmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLCBtYW5hZ2VyOiBNYW5hZ2VyKTogUmVsYXkge1xyXG4gICAgICAgIGxldCByZWxheSA9IGFycmF5W2FycmF5SW5kZXhdO1xyXG4gICAgICAgIGlmIChyZWxheSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJlbGF5ID0gYXJyYXlbYXJyYXlJbmRleF0gPSBuZXcgUmVsYXkodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbWFuYWdlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAocHJvcGVydHlJbmRleCAlIDMpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgcmVsYXkubmFtZVZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIHJlbGF5LnJ1bGVJbmRleFZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIHJlbGF5LnN0YXRlVmFyID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVsYXk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdWxlVHlwZSB9IGZyb20gXCIuL0VudW1zXCI7XHJcbmltcG9ydCB7IGFkZFJlbGF0aXZlQ2FsbGJhY2ssIGNyZWF0ZURyYWdUYXJnZXQsIGVuYWJsZURyb3AsIHNlY29uZHNUb0RhdGUgfSBmcm9tIFwiLi9IZWxwZXJcIjtcclxuaW1wb3J0IHsgSURyYWdBbmREcm9wIH0gZnJvbSBcIi4vSURyYWdBbmREcm9wXCI7XHJcbmltcG9ydCB7IElTYXZlYWJsZSB9IGZyb20gXCIuL0lTYXZlYWJsZVwiO1xyXG5pbXBvcnQgeyBNYW5hZ2VyIH0gZnJvbSBcIi4vTWFuYWdlclwiO1xyXG5pbXBvcnQgeyBSZWFsdGltZSB9IGZyb20gXCIuL1JlYWx0aW1lXCI7XHJcbmltcG9ydCB7IFNlbnNvciB9IGZyb20gXCIuL1NlbnNvclwiO1xyXG5pbXBvcnQgeyBTaGFyZWRWYXJpYWJsZSB9IGZyb20gXCIuL1NoYXJlZFZhcmlhYmxlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVsZSBleHRlbmRzIFJlYWx0aW1lIGltcGxlbWVudHMgSVNhdmVhYmxlLCBJRHJhZ0FuZERyb3Age1xyXG4gICAgLy8jcmVnaW9uIG5hbWVcclxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZVZhci52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgc2V0IG5hbWUodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubmFtZVZhci52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIHN0YXJ0XHJcbiAgICBnZXQgc3RhcnQoKTogc3RyaW5nIHwgbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFydFZhci52YWx1ZTtcclxuICAgIH1cclxuICAgIHNldCBzdGFydChzOiBzdHJpbmcgfCBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnN0YXJ0VmFyLnZhbHVlID0gcztcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBlbmRcclxuICAgIGdldCBlbmQoKTogc3RyaW5nIHwgbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmRWYXIudmFsdWU7XHJcbiAgICB9XHJcbiAgICBzZXQgZW5kKHM6IHN0cmluZyB8IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZW5kVmFyLnZhbHVlID0gcztcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiB0eXBlXHJcbiAgICBnZXQgdHlwZSgpOiBSdWxlVHlwZSB7XHJcbiAgICAgICAgcmV0dXJuIDxudW1iZXI+dGhpcy50eXBlVmFyLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgc2V0IHR5cGUodHlwZTogUnVsZVR5cGUpIHtcclxuICAgICAgICB0aGlzLnR5cGVWYXIudmFsdWUgPSB0eXBlO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIHRhcmdldFxyXG4gICAgZ2V0IHRhcmdldCgpOiBTZW5zb3Ige1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIuZ2V0U2Vuc29yKDxudW1iZXI+dGhpcy50YXJnZXRWYXIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgc2V0IHRhcmdldChzZW5zb3I6IFNlbnNvcikge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMubWFuYWdlci5nZXRTZW5zb3JSZWxhdGl2ZUluZGV4KHNlbnNvcik7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0VmFyLnZhbHVlID0gaW5kZXg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnNlbnNvckVsZW1lbnQgJiYgc2Vuc29yKSB7XHJcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnNlbnNvckVsZW1lbnQpLnZhbHVlID0gc2Vuc29yLm1haW5OYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBzdWJSdWxlQVxyXG4gICAgZ2V0IHN1YlJ1bGVBKCk6IFJ1bGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIucnVsZXNbPG51bWJlcj50aGlzLnN1YlJ1bGVBVmFyLnZhbHVlXTtcclxuICAgIH1cclxuICAgIHNldCBzdWJSdWxlQShydWxlOiBSdWxlKSB7XHJcbiAgICAgICAgdGhpcy5zdWJSdWxlQVZhci52YWx1ZSA9IHRoaXMubWFuYWdlci5ydWxlcy5pbmRleE9mKHJ1bGUpO1xyXG4gICAgICAgIGlmICh0aGlzLnN1YlJ1bGVBVmFyLnZhbHVlID09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3ViUnVsZUFWYXIudmFsdWUgPSAweDdGRkZGRkZGO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zdWJSdWxlQUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3ViUnVsZUEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3ViUnVsZUFFbGVtZW50LnZhbHVlID0gdGhpcy5zdWJSdWxlQS5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWJSdWxlQUVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIHN1YlJ1bGVCXHJcbiAgICBnZXQgc3ViUnVsZUIoKTogUnVsZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5ydWxlc1s8bnVtYmVyPnRoaXMuc3ViUnVsZUJWYXIudmFsdWVdO1xyXG4gICAgfVxyXG4gICAgc2V0IHN1YlJ1bGVCKHJ1bGU6IFJ1bGUpIHtcclxuICAgICAgICB0aGlzLnN1YlJ1bGVCVmFyLnZhbHVlID0gdGhpcy5tYW5hZ2VyLnJ1bGVzLmluZGV4T2YocnVsZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuc3ViUnVsZUJWYXIudmFsdWUgPT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJSdWxlQlZhci52YWx1ZSA9IDB4N0ZGRkZGRkY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnN1YlJ1bGVCRWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdWJSdWxlQikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWJSdWxlQkVsZW1lbnQudmFsdWUgPSB0aGlzLnN1YlJ1bGVCLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1YlJ1bGVCRWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIG5hbWVWYXI6IFNoYXJlZFZhcmlhYmxlLFxyXG4gICAgICAgIHByaXZhdGUgc3RhcnRWYXI6IFNoYXJlZFZhcmlhYmxlLFxyXG4gICAgICAgIHByaXZhdGUgZW5kVmFyOiBTaGFyZWRWYXJpYWJsZSxcclxuICAgICAgICBwcml2YXRlIHR5cGVWYXI6IFNoYXJlZFZhcmlhYmxlLFxyXG4gICAgICAgIHByaXZhdGUgdGFyZ2V0VmFyOiBTaGFyZWRWYXJpYWJsZSxcclxuICAgICAgICBwcml2YXRlIHN1YlJ1bGVBVmFyOiBTaGFyZWRWYXJpYWJsZSxcclxuICAgICAgICBwcml2YXRlIHN1YlJ1bGVCVmFyOiBTaGFyZWRWYXJpYWJsZSxcclxuICAgICAgICBwcml2YXRlIG1hbmFnZXI6IE1hbmFnZXJcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKG1hbmFnZXIpO1xyXG4gICAgfVxyXG4gICAgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcInJ1bGVcIjtcclxuICAgIH1cclxuICAgIGhhbmRsZURyb3Aob2JqOiBJRHJhZ0FuZERyb3AsIHRhcmdldDogRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaCAob2JqLmdldFR5cGUoKSkge1xyXG4gICAgICAgICAgICBjYXNlIFwic2Vuc29yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldCA9IDxTZW5zb3I+PGFueT5vYmo7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInJ1bGVcIjpcclxuICAgICAgICAgICAgICAgIGxldCBhSW5kZXggPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwicnVsZS1hXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJJbmRleCA9IHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJydWxlLWJcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoYUluZGV4KSB0aGlzLnN1YlJ1bGVBID0gPFJ1bGU+b2JqO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJJbmRleCkgdGhpcy5zdWJSdWxlQiA9IDxSdWxlPm9iajtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIENyZWF0ZVdpdGhQcm9wZXJ0eShhcnJheTogUnVsZVtdLCBhcnJheUluZGV4OiBudW1iZXIsIHByb3BlcnR5SW5kZXg6IG51bWJlciwgdmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLCBtYW5hZ2VyOiBNYW5hZ2VyKTogUnVsZSB7XHJcbiAgICAgICAgbGV0IHJ1bGUgPSBhcnJheVthcnJheUluZGV4XTtcclxuICAgICAgICBpZiAocnVsZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJ1bGUgPSBhcnJheVthcnJheUluZGV4XSA9IG5ldyBSdWxlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbWFuYWdlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAocHJvcGVydHlJbmRleCAlIDcpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgcnVsZS5zdGFydFZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIHJ1bGUuZW5kVmFyID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgcnVsZS50eXBlVmFyID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgcnVsZS50YXJnZXRWYXIgPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICBydWxlLnN1YlJ1bGVBVmFyID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgcnVsZS5zdWJSdWxlQlZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgICAgIHJ1bGUubmFtZVZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJ1bGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudDtcclxuICAgIGdldCBlbGVtZW50KCk6IEVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xyXG4gICAgfVxyXG4gICAgc2V0IGVsZW1lbnQoZWw6IEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWw7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmlkID0gdGhpcy5pZDtcclxuICAgICAgICB0aGlzLm5hbWVFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJydWxlLW5hbWVcIilbMV07XHJcbiAgICAgICAgdGhpcy5zdGFydEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD50aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInJ1bGUtc3RhcnRcIilbMV07XHJcbiAgICAgICAgdGhpcy5lbmRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJydWxlLWVuZFwiKVsxXTtcclxuICAgICAgICB0aGlzLnNlbnNvckVsZW1lbnQgPSB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInJ1bGUtc2Vuc29yXCIpWzFdO1xyXG4gICAgICAgIHRoaXMuc2Vuc29yVHlwZUVsZW1lbnQgPSA8SFRNTFNlbGVjdEVsZW1lbnQ+dGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJydWxlLXNlbnNvci10eXBlXCIpWzFdO1xyXG4gICAgICAgIHRoaXMuc3ViUnVsZUFFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJydWxlLWFcIilbMV07XHJcbiAgICAgICAgdGhpcy5zdWJSdWxlQkVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD50aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInJ1bGUtYlwiKVsxXTtcclxuXHJcbiAgICAgICAgdGhpcy5zdWJSdWxlQUNsZWFyQnV0dG9uID0gdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJydWxlLWFcIilbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJidXR0b25cIilbMF07XHJcbiAgICAgICAgdGhpcy5zdWJSdWxlQkNsZWFyQnV0dG9uID0gdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJydWxlLWJcIilbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJidXR0b25cIilbMF07XHJcblxyXG4gICAgICAgIHRoaXMuc3ViUnVsZUFDbGVhckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zdWJSdWxlQSA9IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5zdWJSdWxlQkNsZWFyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnN1YlJ1bGVCID0gdW5kZWZpbmVkKTtcclxuXHJcbiAgICAgICAgdGhpcy50eXBlVmFyLmJpbmRTZWxlY3QodGhpcy5zZW5zb3JUeXBlRWxlbWVudCwgKCkgPT4geyB0aGlzLnVwZGF0ZVN0eWxlKCkgfSk7XHJcbiAgICAgICAgdGhpcy5uYW1lVmFyLmJpbmRUZXh0KHRoaXMubmFtZUVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRoaXMudGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuc3ViUnVsZUEgPSB0aGlzLnN1YlJ1bGVBO1xyXG4gICAgICAgIHRoaXMuc3ViUnVsZUIgPSB0aGlzLnN1YlJ1bGVCO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVN0eWxlKCk7XHJcblxyXG4gICAgICAgIGVuYWJsZURyb3AodGhpcy5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICB9XHJcbiAgICBuYW1lRWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHN0YXJ0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuICAgIGVuZEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBzZW5zb3JFbGVtZW50OiBFbGVtZW50O1xyXG4gICAgc2Vuc29yVHlwZUVsZW1lbnQ6IEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gICAgc3ViUnVsZUFFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgc3ViUnVsZUJFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgc3ViUnVsZUFDbGVhckJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBzdWJSdWxlQkNsZWFyQnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHVwZGF0ZUhhbmRsZXIoKSB7IH1cclxuXHJcbiAgICBfcHJldlR5cGU6IFJ1bGVUeXBlID0gMDtcclxuICAgIHVwZGF0ZVN0eWxlKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFJ1bGVUeXBlW3RoaXMuX3ByZXZUeXBlXSk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoUnVsZVR5cGVbdGhpcy50eXBlXSk7XHJcbiAgICAgICAgdGhpcy5fcHJldlR5cGUgPSB0aGlzLnR5cGU7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgUnVsZVR5cGUuQlVTX01BSU46XHJcbiAgICAgICAgICAgIGNhc2UgUnVsZVR5cGUuQlVTX01JU0M6XHJcbiAgICAgICAgICAgIGNhc2UgUnVsZVR5cGUuQ1BXTTpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRFbGVtZW50LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRWxlbWVudC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RWxlbWVudC52YWx1ZSA9IHRoaXMuc3RhcnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRWxlbWVudC52YWx1ZSA9IHRoaXMuZW5kLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBSdWxlVHlwZS5USU1FOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEVsZW1lbnQudHlwZSA9IFwidGltZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRFbGVtZW50LnR5cGUgPSBcInRpbWVcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRFbGVtZW50LnZhbHVlID0gc2Vjb25kc1RvRGF0ZSg8bnVtYmVyPnRoaXMuc3RhcnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRFbGVtZW50LnZhbHVlID0gc2Vjb25kc1RvRGF0ZSg8bnVtYmVyPnRoaXMuZW5kKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRVcmxTZXR0ZXIoKTogc3RyaW5nIHtcclxuICAgICAgICB0aGlzLnN0YXJ0VmFyLnNldCh0aGlzLnN0YXJ0RWxlbWVudC52YWx1ZSwgdGhpcy50eXBlKTtcclxuICAgICAgICB0aGlzLmVuZFZhci5zZXQodGhpcy5lbmRFbGVtZW50LnZhbHVlLCB0aGlzLnR5cGUpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMubmFtZVZhci5nZXRVcmxTZXR0ZXIoKSArXHJcbiAgICAgICAgICAgIFwiJlwiICtcclxuICAgICAgICAgICAgdGhpcy5zdGFydFZhci5nZXRVcmxTZXR0ZXIoKSArXHJcbiAgICAgICAgICAgIFwiJlwiICtcclxuICAgICAgICAgICAgdGhpcy5lbmRWYXIuZ2V0VXJsU2V0dGVyKCkgK1xyXG4gICAgICAgICAgICBcIiZcIiArXHJcbiAgICAgICAgICAgIHRoaXMudHlwZVZhci5nZXRVcmxTZXR0ZXIoKSArXHJcbiAgICAgICAgICAgIFwiJlwiICtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRWYXIuZ2V0VXJsU2V0dGVyKCkgK1xyXG4gICAgICAgICAgICBcIiZcIiArXHJcbiAgICAgICAgICAgIHRoaXMuc3ViUnVsZUFWYXIuZ2V0VXJsU2V0dGVyKCkgK1xyXG4gICAgICAgICAgICBcIiZcIiArXHJcbiAgICAgICAgICAgIHRoaXMuc3ViUnVsZUJWYXIuZ2V0VXJsU2V0dGVyKClcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGFkZFJlbGF0aXZlQ2FsbGJhY2ssIGNyZWF0ZURyYWdUYXJnZXQsIHV1aWR2NCB9IGZyb20gXCIuL0hlbHBlclwiO1xyXG5pbXBvcnQgeyBJRHJhZ0FuZERyb3AgfSBmcm9tIFwiLi9JRHJhZ0FuZERyb3BcIjtcclxuaW1wb3J0IHsgSVNhdmVhYmxlIH0gZnJvbSBcIi4vSVNhdmVhYmxlXCI7XHJcbmltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9NYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFJlYWx0aW1lIH0gZnJvbSBcIi4vUmVhbHRpbWVcIjtcclxuaW1wb3J0IHsgU2hhcmVkVmFyaWFibGUgfSBmcm9tIFwiLi9TaGFyZWRWYXJpYWJsZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNlbnNvciBleHRlbmRzIFJlYWx0aW1lIGltcGxlbWVudHMgSVNhdmVhYmxlLCBJRHJhZ0FuZERyb3Age1xyXG4gICAgLy8jcmVnaW9uIG1haW5cclxuICAgIGdldCBtYWluKCk6IG51bWJlciB8IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFpblZhci52YWx1ZTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBtaXNjXHJcbiAgICBnZXQgbWlzYygpOiBudW1iZXIgfCBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1pc2NWYXIudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gbWFpbk5hbWVcclxuICAgIGdldCBtYWluTmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1haW5OYW1lVmFyLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgICBzZXQgbWFpbk5hbWUodGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5tYWluTmFtZVZhci52YWx1ZSA9IHRleHQ7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBzZW5zb3JNYWluOiBFbGVtZW50O1xyXG4gICAgc2Vuc29yTWlzYzogRWxlbWVudDtcclxuICAgIHNlbnNvck5hbWU6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50O1xyXG4gICAgZ2V0IGVsZW1lbnQoKTogRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICBzZXQgZWxlbWVudChlbDogRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbDtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVsZW1lbnQuaWQgPSB0aGlzLmlkO1xyXG4gICAgICAgIHRoaXMuc2Vuc29yTWFpbiA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2Vuc29yLW1haW5cIilbMV07XHJcbiAgICAgICAgdGhpcy5zZW5zb3JNaXNjID0gdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzZW5zb3ItbWlzY1wiKVsxXTtcclxuICAgICAgICB0aGlzLnNlbnNvck5hbWUgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0LnNlbnNvci1uYW1lLW1haW5cIik7XHJcbiAgICAgICAgaWYgKHRoaXMuc2Vuc29yTmFtZSAmJiB0aGlzLm1haW5OYW1lVmFyKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFNlbnNvclR5cGUuR0VORVJBTDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1haW5OYW1lVmFyLmJpbmRUZXh0KHRoaXMuc2Vuc29yTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFNlbnNvclR5cGUuQU5BTE9HOlxyXG4gICAgICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnNlbnNvck5hbWUpLnZhbHVlID0gdGhpcy5tYWluTmFtZVZhci5fdmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbnNvck5hbWUuc2V0QXR0cmlidXRlKFwicmVhZG9ubHlcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgbWFpbk5hbWVWYXI6IFNoYXJlZFZhcmlhYmxlLFxyXG4gICAgICAgIHB1YmxpYyBtaXNjTmFtZVZhcjogU2hhcmVkVmFyaWFibGUsXHJcbiAgICAgICAgcHVibGljIG1haW5WYXI6IFNoYXJlZFZhcmlhYmxlLFxyXG4gICAgICAgIHB1YmxpYyBtaXNjVmFyOiBTaGFyZWRWYXJpYWJsZSxcclxuICAgICAgICBwdWJsaWMgbWFuYWdlcjogTWFuYWdlcixcclxuICAgICAgICBwdWJsaWMgdHlwZTogU2Vuc29yVHlwZSA9IFNlbnNvclR5cGUuR0VORVJBTFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIobWFuYWdlcik7XHJcbiAgICB9XHJcbiAgICBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwic2Vuc29yXCI7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVEcm9wKG9iajogSURyYWdBbmREcm9wLCB0YXJnZXQ6IEVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBDcmVhdGVXaXRoUHJvcGVydHkoXHJcbiAgICAgICAgYXJyYXk6IFNlbnNvcltdLFxyXG4gICAgICAgIGFycmF5SW5kZXg6IG51bWJlcixcclxuICAgICAgICBwcm9wZXJ0eUluZGV4OiBudW1iZXIsXHJcbiAgICAgICAgdmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLFxyXG4gICAgICAgIG1hbmFnZXI6IE1hbmFnZXIsXHJcbiAgICAgICAgdHlwZTogU2Vuc29yVHlwZSA9IFNlbnNvclR5cGUuR0VORVJBTFxyXG4gICAgKTogU2Vuc29yIHtcclxuICAgICAgICBsZXQgc2Vuc29yID0gYXJyYXlbYXJyYXlJbmRleF07XHJcbiAgICAgICAgaWYgKHNlbnNvciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNlbnNvciA9IGFycmF5W2FycmF5SW5kZXhdID0gbmV3IFNlbnNvcih1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG1hbmFnZXIsIHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKHByb3BlcnR5SW5kZXggJSAzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHNlbnNvci5tYWluTmFtZVZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIHNlbnNvci5tYWluVmFyID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgc2Vuc29yLm1pc2NWYXIgPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZW5zb3I7XHJcbiAgICB9XHJcbiAgICBnZXRVcmxTZXR0ZXIoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy50eXBlID09IFNlbnNvclR5cGUuQU5BTE9HKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlU5OT0wXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFpbk5hbWVWYXIuZ2V0VXJsU2V0dGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlSGFuZGxlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5zZW5zb3JNYWluICYmIHRoaXMubWFpblZhcikgdGhpcy5zZW5zb3JNYWluLmlubmVySFRNTCA9IHRoaXMubWFpbi50b1N0cmluZygpO1xyXG4gICAgICAgIGlmICh0aGlzLnNlbnNvck1pc2MgJiYgdGhpcy5taXNjVmFyKSB0aGlzLnNlbnNvck1pc2MuaW5uZXJIVE1MID0gdGhpcy5taXNjLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIFNlbnNvclR5cGUge1xyXG4gICAgR0VORVJBTCxcclxuICAgIEFOQUxPRyxcclxufVxyXG4iLCJpbXBvcnQgeyBTaGFyZWRWYXJpYWJsZSB9IGZyb20gXCIuL1NoYXJlZFZhcmlhYmxlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2hhcmVkUmFuZ2Uge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHByZWZpeDpzdHJpbmcscHVibGljIHN0YXJ0Om51bWJlcixwdWJsaWMgZW5kOm51bWJlcixwdWJsaWMgY2FsbGJhY2s6RnVuY3Rpb24sIHB1YmxpYyBvbmx5T25jZTpCb29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVTaGFyZWRWYXIodmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlKSB7XHJcbiAgICAgICAgaWYgKHZhcmlhYmxlLm5hbWVbMF0gPT0gdGhpcy5wcmVmaXggJiYgdGhpcy5zdGFydCA8PSB2YXJpYWJsZS5pbmRleCAmJiB2YXJpYWJsZS5pbmRleCA8PSB0aGlzLmVuZCkge1xyXG4gICAgICAgICAgICB2YXJpYWJsZS5yZWFsVGltZSA9ICF0aGlzLm9ubHlPbmNlO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrKHZhcmlhYmxlLCB2YXJpYWJsZS5pbmRleCAtIHRoaXMuc3RhcnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bGVUeXBlIH0gZnJvbSBcIi4vRW51bXNcIjtcclxuaW1wb3J0IHsgYWRkUmVsYXRpdmVDYWxsYmFjaywgZGF0ZVRvU2Vjb25kcywgcGFkIH0gZnJvbSBcIi4vSGVscGVyXCI7XHJcbmltcG9ydCB7IElTYXZlYWJsZSB9IGZyb20gXCIuL0lTYXZlYWJsZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNoYXJlZFZhcmlhYmxlIGltcGxlbWVudHMgSVNhdmVhYmxlIHtcclxuXHRuYW1lOiBzdHJpbmc7XHJcblx0X3ZhbHVlOiBzdHJpbmcgfCBudW1iZXI7XHJcblx0X3R5cGU6IEJpbmRUeXBlO1xyXG5cdGdldCB2YWx1ZSgpOiBzdHJpbmcgfCBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZhbHVlO1xyXG5cdH1cclxuXHRzZXQgdmFsdWUodmFsOiBzdHJpbmcgfCBudW1iZXIpIHtcclxuXHRcdHRoaXMuX3ZhbHVlID0gdmFsO1xyXG5cdFx0aWYgKHRoaXMuX3RhcmdldCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHN3aXRjaCAodGhpcy5fdHlwZSkge1xyXG5cdFx0XHRcdGNhc2UgQmluZFR5cGUuVGV4dDpcclxuXHRcdFx0XHRcdCg8SFRNTElucHV0RWxlbWVudD50aGlzLl90YXJnZXQpLnZhbHVlID0gdmFsLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIEJpbmRUeXBlLlNlbGVjdDpcclxuXHRcdFx0XHRcdCg8SFRNTFNlbGVjdEVsZW1lbnQ+dGhpcy5fdGFyZ2V0KS5vcHRpb25zLnNlbGVjdGVkSW5kZXggPSA8bnVtYmVyPnZhbDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRpbmRleDogbnVtYmVyO1xyXG5cdHJlYWxUaW1lOiBCb29sZWFuID0gdHJ1ZTtcclxuXHRjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcclxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblx0XHR0aGlzLnZhbHVlID0gdmFsdWU7XHJcblx0XHR0aGlzLmluZGV4ID0gcGFyc2VJbnQobmFtZS5zbGljZSgxKSk7XHJcblx0fVxyXG5cdGdldFVybFNldHRlcigpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIHRoaXMubmFtZSArIFwiPVwiICsgdGhpcy52YWx1ZTtcclxuXHR9XHJcblx0c2V0KHZhbDogc3RyaW5nLCB0eXBlOiBSdWxlVHlwZSkge1xyXG5cdFx0c3dpdGNoICh0eXBlKSB7XHJcblx0XHRcdGNhc2UgUnVsZVR5cGUuQlVTX01BSU46XHJcblx0XHRcdGNhc2UgUnVsZVR5cGUuQlVTX01JU0M6XHJcblx0XHRcdGNhc2UgUnVsZVR5cGUuQ1BXTTpcclxuXHRcdFx0XHR0aGlzLl92YWx1ZSA9IHBhcnNlSW50KHZhbCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgUnVsZVR5cGUuVElNRTpcclxuXHRcdFx0XHR0aGlzLl92YWx1ZSA9IGRhdGVUb1NlY29uZHModmFsKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblx0cHJpdmF0ZSBfdGFyZ2V0OiBFbGVtZW50O1xyXG5cdGJpbmRUZXh0KHRhcmdldDogSFRNTElucHV0RWxlbWVudCwgYWN0aW9uOiAoKSA9PiBhbnkgPSBudWxsKSB7XHJcblx0XHR0aGlzLl90eXBlID0gQmluZFR5cGUuVGV4dDtcclxuXHRcdHRoaXMuX3RhcmdldCA9IHRhcmdldDtcclxuXHRcdGFkZFJlbGF0aXZlQ2FsbGJhY2sodGhpcy5fdGFyZ2V0LCBcImNoYW5nZVwiLCB0aGlzLCAoeCkgPT4ge1xyXG5cdFx0XHR4Ll92YWx1ZSA9ICg8SFRNTElucHV0RWxlbWVudD54Ll90YXJnZXQpLnZhbHVlO1xyXG5cdFx0XHRpZiAoYWN0aW9uKSB7XHJcblx0XHRcdFx0YWN0aW9uKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9UT0RPOiByZW1vdmUgZGVidWdcclxuXHRcdFx0Y29uc29sZS5sb2coeCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xyXG5cdH1cclxuXHRiaW5kU2VsZWN0KHRhcmdldDogSFRNTFNlbGVjdEVsZW1lbnQsIGFjdGlvbjogKCkgPT4gYW55ID0gbnVsbCkge1xyXG5cdFx0dGhpcy5fdHlwZSA9IEJpbmRUeXBlLlNlbGVjdDtcclxuXHRcdHRoaXMuX3RhcmdldCA9IHRhcmdldDtcclxuXHRcdGFkZFJlbGF0aXZlQ2FsbGJhY2sodGhpcy5fdGFyZ2V0LCBcImNoYW5nZVwiLCB0aGlzLCAoeCkgPT4ge1xyXG5cdFx0XHR4Ll92YWx1ZSA9ICg8SFRNTFNlbGVjdEVsZW1lbnQ+eC5fdGFyZ2V0KS5vcHRpb25zLnNlbGVjdGVkSW5kZXg7XHJcblx0XHRcdGlmIChhY3Rpb24pIHtcclxuXHRcdFx0XHRhY3Rpb24oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvL1RPRE86IHJlbW92ZSBkZWJ1Z1xyXG5cdFx0XHRjb25zb2xlLmxvZyh4KTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XHJcblx0fVxyXG59XHJcblxyXG5lbnVtIEJpbmRUeXBlIHtcclxuXHRUZXh0LFxyXG5cdFNlbGVjdFxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBNYW5hZ2VyIH0gZnJvbSBcIi4vTWFuYWdlclwiXHJcblxyXG5jb25zdCBtYW5hZ2VyID0gbmV3IE1hbmFnZXIoKTsiXSwic291cmNlUm9vdCI6IiJ9