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
                this.sendSharedWriteRequest("U98=1");
                return;
            case Enums_1.SaveTarget.SENSOR:
                for (const sensor of this.sensors) {
                    this.sendSharedWriteRequest(sensor.getUrlSetter());
                }
                return;
            case Enums_1.SaveTarget.RULE:
                for (const rule of this.rules) {
                    this.sendSharedWriteRequest(rule.getUrlSetter());
                }
                return;
            case Enums_1.SaveTarget.RELAY:
                for (const relay of this.relays) {
                    this.sendSharedWriteRequest(relay.getUrlSetter());
                }
                return;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQzovVXNlcnMvbHVrYXMvc291cmNlL3JlcG9zL2NoYWxvdXBrYV96YXZsYXpvdmFuaS9zcmMvQXR0YWNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0M6L1VzZXJzL2x1a2FzL3NvdXJjZS9yZXBvcy9jaGFsb3Vwa2FfemF2bGF6b3Zhbmkvc3JjL0VudW1zLnRzIiwid2VicGFjazovLy8uL3NyYy9DOi9Vc2Vycy9sdWthcy9zb3VyY2UvcmVwb3MvY2hhbG91cGthX3phdmxhem92YW5pL3NyYy9IZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0M6L1VzZXJzL2x1a2FzL3NvdXJjZS9yZXBvcy9jaGFsb3Vwa2FfemF2bGF6b3Zhbmkvc3JjL01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0M6L1VzZXJzL2x1a2FzL3NvdXJjZS9yZXBvcy9jaGFsb3Vwa2FfemF2bGF6b3Zhbmkvc3JjL1JlYWx0aW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9DOi9Vc2Vycy9sdWthcy9zb3VyY2UvcmVwb3MvY2hhbG91cGthX3phdmxhem92YW5pL3NyYy9SZWxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQzovVXNlcnMvbHVrYXMvc291cmNlL3JlcG9zL2NoYWxvdXBrYV96YXZsYXpvdmFuaS9zcmMvUnVsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQzovVXNlcnMvbHVrYXMvc291cmNlL3JlcG9zL2NoYWxvdXBrYV96YXZsYXpvdmFuaS9zcmMvU2Vuc29yLnRzIiwid2VicGFjazovLy8uL3NyYy9DOi9Vc2Vycy9sdWthcy9zb3VyY2UvcmVwb3MvY2hhbG91cGthX3phdmxhem92YW5pL3NyYy9TaGFyZWRSYW5nZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQzovVXNlcnMvbHVrYXMvc291cmNlL3JlcG9zL2NoYWxvdXBrYV96YXZsYXpvdmFuaS9zcmMvU2hhcmVkVmFyaWFibGUudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9DOi9Vc2Vycy9sdWthcy9zb3VyY2UvcmVwb3MvY2hhbG91cGthX3phdmxhem92YW5pL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFhLFFBQVE7SUFZakIsWUFBbUIsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQVRuQyxrQkFBYSxHQUFXLE1BQU0sQ0FBQztRQUkvQixvQkFBZSxHQUFXLFFBQVEsQ0FBQztRQUluQyxtQkFBYyxHQUFXLE9BQU8sQ0FBQztRQUU3QixJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQztRQUNyRCxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUM7UUFDekQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXRELElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVwRCxLQUFLLE1BQU0sSUFBSSxJQUFJLE9B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VUFBVSxDQUFDLE1BQXlCLEVBQUUsU0FBb0IsSUFBSTtRQUM3RCxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsNEJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDdkQsQ0FBQyxDQUFDLE1BQU0sR0FBdUIsQ0FBQyxDQUFDLE9BQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1lBQ2hFLElBQUksTUFBTSxFQUFFO2dCQUNYLE1BQU0sRUFBRSxDQUFDO2FBQ1Q7WUFDRCxvQkFBb0I7WUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN6QixDQUFDO0NBQ0Q7QUF2RUQsd0NBdUVDO0FBRUQsSUFBSyxRQUdKO0FBSEQsV0FBSyxRQUFRO0lBQ1osdUNBQUk7SUFDSiwyQ0FBTTtBQUNQLENBQUMsRUFISSxRQUFRLEtBQVIsUUFBUSxRQUdaOzs7Ozs7O1VDaEZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQSwyRUFBbUM7QUFFbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUMiLCJmaWxlIjoiaHlkcm8tYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL01hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBdHRhY2hlciB7XHJcbiAgICBydWxlQ29udGFpbmVyOiBFbGVtZW50O1xyXG4gICAgcnVsZVRlbXBsYXRlOiBFbGVtZW50O1xyXG4gICAgcnVsZUNsYXNzTmFtZTogc3RyaW5nID0gXCJydWxlXCI7XHJcblxyXG4gICAgc2Vuc29yQ29udGFpbmVyOiBFbGVtZW50O1xyXG4gICAgc2Vuc29yVGVtcGxhdGU6IEVsZW1lbnQ7XHJcbiAgICBzZW5zb3JDbGFzc05hbWU6IHN0cmluZyA9IFwic2Vuc29yXCI7XHJcblxyXG4gICAgcmVsYXlDb250YWluZXI6IEVsZW1lbnQ7XHJcbiAgICByZWxheVRlbXBsYXRlOiBFbGVtZW50O1xyXG4gICAgcmVsYXlDbGFzc05hbWU6IHN0cmluZyA9IFwicmVsYXlcIjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtYW5hZ2VyOiBNYW5hZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5ydWxlVGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMucnVsZUNsYXNzTmFtZSlbMF07XHJcbiAgICAgICAgdGhpcy5ydWxlQ29udGFpbmVyID0gdGhpcy5ydWxlVGVtcGxhdGUucGFyZW50RWxlbWVudDtcclxuICAgICAgICB0aGlzLnJ1bGVDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5ydWxlVGVtcGxhdGUpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbnNvclRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnNlbnNvckNsYXNzTmFtZSlbMF07XHJcbiAgICAgICAgdGhpcy5zZW5zb3JDb250YWluZXIgPSB0aGlzLnNlbnNvclRlbXBsYXRlLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5zZW5zb3JDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5zZW5zb3JUZW1wbGF0ZSk7XHJcblxyXG4gICAgICAgIHRoaXMucmVsYXlUZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5yZWxheUNsYXNzTmFtZSlbMF07XHJcbiAgICAgICAgdGhpcy5yZWxheUNvbnRhaW5lciA9IHRoaXMucmVsYXlUZW1wbGF0ZS5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIHRoaXMucmVsYXlDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5yZWxheVRlbXBsYXRlKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBydWxlIG9mIG1hbmFnZXIucnVsZXMpIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IE5vZGUgPSB0aGlzLnJ1bGVUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMucnVsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgICAgICAgICAgcnVsZS5lbGVtZW50ID0gdGhpcy5ydWxlQ29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5ydWxlQ2xhc3NOYW1lKVt0aGlzLnJ1bGVDb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgLSAxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBzZW5zb3Igb2YgbWFuYWdlci5zZW5zb3JzKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBOb2RlID0gdGhpcy5zZW5zb3JUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2Vuc29yQ29udGFpbmVyLmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgICAgICAgICBzZW5zb3IuZWxlbWVudCA9IHRoaXMuc2Vuc29yQ29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5zZW5zb3JDbGFzc05hbWUpW3RoaXMuc2Vuc29yQ29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50IC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoY29uc3QgcmVsYXkgb2YgbWFuYWdlci5yZWxheXMpIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IE5vZGUgPSB0aGlzLnJlbGF5VGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbGF5Q29udGFpbmVyLmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgICAgICAgICByZWxheS5lbGVtZW50ID0gdGhpcy5yZWxheUNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMucmVsYXlDbGFzc05hbWUpW3RoaXMucmVsYXlDb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgLSAxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBSdWxlVHlwZSB7XHJcbiAgICBOT05FID0gMCxcclxuICAgIFRJTUUgPSAxLFxyXG4gICAgQlVTX01BSU4gPSAyLFxyXG4gICAgQlVTX01JU0MgPSAzLFxyXG4gICAgQ1BXTSA9IDQsXHJcblxyXG4gICAgcnVsZV9ub25lID0gMCxcclxuICAgIHJ1bGVfdGltZSA9IDEsXHJcbiAgICBydWxlX3RlbXAgPSAyLFxyXG4gICAgcnVsZV9odW1pID0gMyxcclxuICAgIHJ1bGVfY3B3bSA9IDQsXHJcblxyXG59XHJcbmV4cG9ydCBlbnVtIFJlbGF5SW5kZXhlcyB7XHJcbiAgICBURVhUID0gMCxcclxuICAgIFJVTEUgPSAxLFxyXG4gICAgU1RBVEUgPSAyLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBTYXZlVGFyZ2V0IHtcclxuICAgIEFMTCA9IDAsXHJcbiAgICBTRU5TT1IgPSAxLFxyXG4gICAgUlVMRSA9IDIsXHJcbiAgICBSRUxBWSA9IDMsXHJcbn0iLCJleHBvcnQgZnVuY3Rpb24gcGFkKG51bTogc3RyaW5nIHwgbnVtYmVyLCBzaXplOiBudW1iZXIpIHtcclxuICAgIG51bSA9IG51bS50b1N0cmluZygpO1xyXG4gICAgd2hpbGUgKG51bS5sZW5ndGggPCBzaXplKSBudW0gPSBcIjBcIiArIG51bTtcclxuICAgIHJldHVybiBudW07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRSZWxhdGl2ZUNhbGxiYWNrPFQ+KHRhcmdldDogRXZlbnRUYXJnZXQsIGV2ZW50OiBzdHJpbmcsIG9iajogVCwgY2FsbGJhY2s6IChvYmo6IFQpID0+IHZvaWQpIHtcclxuICAgIChmdW5jdGlvbiAoczogVCwgbTogRXZlbnRUYXJnZXQsIGNhbGw6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCAoKSA9PiBjYWxsYmFjayhzKSwgZmFsc2UpO1xyXG4gICAgfSkob2JqLCB0YXJnZXQsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURyYWdUYXJnZXQoZWxlbWVudDogRWxlbWVudCkge1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgKGUpID0+IHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXVpZHY0KCk6IHN0cmluZyB7XHJcbiAgICAvL0B0cy1pZ25vcmVcclxuICAgIHJldHVybiAoWzFlN10gKyAtMWUzICsgLTRlMyArIC04ZTMgKyAtMWUxMSkucmVwbGFjZSgvWzAxOF0vZywgYyA9PlxyXG4gICAgICAgIChjIF4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxKSlbMF0gJiAxNSA+PiBjIC8gNCkudG9TdHJpbmcoMTYpXHJcbiAgICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2Vjb25kc1RvRGF0ZShzZWNvbmRzOiBudW1iZXIpIHtcclxuICAgIGxldCBoID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XHJcbiAgICBzZWNvbmRzICU9IDM2MDA7XHJcbiAgICBsZXQgbSA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcclxuICAgIHNlY29uZHMgJT0gNjA7XHJcbiAgICByZXR1cm4gcGFkKGgsIDIpICsgXCI6XCIgKyBwYWQobSwgMikgKyBcIjpcIiArIHBhZChzZWNvbmRzLCAyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVUb1NlY29uZHMoZGF0ZTogc3RyaW5nKSB7XHJcbiAgICBsZXQgYXJyID0gZGF0ZS5zcGxpdChcIjpcIik7XHJcblxyXG4gICAgbGV0IHN1bSA9IDA7XHJcbiAgICBpZiAoYXJyWzBdKSB7XHJcbiAgICAgICAgc3VtICs9IHBhcnNlSW50KGFyclswXSkgKiAzNjAwXHJcbiAgICB9XHJcbiAgICBpZiAoYXJyWzFdKSB7XHJcbiAgICAgICAgc3VtICs9IHBhcnNlSW50KGFyclsxXSkgKiA2MFxyXG4gICAgfVxyXG4gICAgaWYgKGFyclsyXSkge1xyXG4gICAgICAgIHN1bSArPSBwYXJzZUludChhcnJbMl0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN1bTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZURyb3AodGFyZ2V0OiBFbGVtZW50KSB7XHJcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIHggPT4ge1xyXG4gICAgICAgIHgucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB4LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSlcclxufSIsImltcG9ydCB7IEF0dGFjaGVyIH0gZnJvbSBcIi4vQXR0YWNoZXJcIjtcclxuaW1wb3J0IHsgUmVsYXlJbmRleGVzLCBSdWxlVHlwZSwgU2F2ZVRhcmdldCB9IGZyb20gXCIuL0VudW1zXCI7XHJcbmltcG9ydCB7IElEcmFnQW5kRHJvcCB9IGZyb20gXCIuL0lEcmFnQW5kRHJvcFwiO1xyXG5pbXBvcnQgeyBJU2F2ZWFibGUgfSBmcm9tIFwiLi9JU2F2ZWFibGVcIjtcclxuaW1wb3J0IHsgUmVsYXkgfSBmcm9tIFwiLi9SZWxheVwiO1xyXG5pbXBvcnQgeyBSdWxlIH0gZnJvbSBcIi4vUnVsZVwiO1xyXG5pbXBvcnQgeyBTZW5zb3IsIFNlbnNvclR5cGUgfSBmcm9tIFwiLi9TZW5zb3JcIjtcclxuaW1wb3J0IHsgU2hhcmVkUmFuZ2UgfSBmcm9tIFwiLi9TaGFyZWRSYW5nZVwiO1xyXG5pbXBvcnQgeyBTaGFyZWRWYXJpYWJsZSB9IGZyb20gXCIuL1NoYXJlZFZhcmlhYmxlXCI7XHJcblxyXG52YXIgbWFuYWdlcjogTWFuYWdlcjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNYW5hZ2VyIGV4dGVuZHMgRXZlbnRUYXJnZXQge1xyXG4gICAgc2hhcmVkUmFuZ2VzOiBTaGFyZWRSYW5nZVtdID0gW1xyXG4gICAgICAgIG5ldyBTaGFyZWRSYW5nZShcIlRcIiwgMSwgNCwgKHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmJ1c19hX25hbWVzW2luZGV4XSA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICBTZW5zb3IuQ3JlYXRlV2l0aFByb3BlcnR5KHRoaXMuYnVzX2EsIGluZGV4LCAwLCB2YXJpYWJsZSwgbWFuYWdlcik7XHJcbiAgICAgICAgfSwgdHJ1ZSksXHJcbiAgICAgICAgbmV3IFNoYXJlZFJhbmdlKFwiVFwiLCAxMSwgMTQsICh2YXJpYWJsZTogU2hhcmVkVmFyaWFibGUsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5idXNfYl9uYW1lc1tpbmRleF0gPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgU2Vuc29yLkNyZWF0ZVdpdGhQcm9wZXJ0eSh0aGlzLmJ1c19iLCBpbmRleCwgMCwgdmFyaWFibGUsIG1hbmFnZXIpO1xyXG4gICAgICAgIH0sIHRydWUpLFxyXG4gICAgICAgIG5ldyBTaGFyZWRSYW5nZShcIlRcIiwgMjEsIDMwLCAodmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucnVsZV9uYW1lc1tpbmRleF0gPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgUnVsZS5DcmVhdGVXaXRoUHJvcGVydHkobWFuYWdlci5ydWxlcywgaW5kZXgsIDYsIHZhcmlhYmxlLCBtYW5hZ2VyKTtcclxuICAgICAgICB9LCB0cnVlKSxcclxuICAgICAgICBuZXcgU2hhcmVkUmFuZ2UoXCJUXCIsIDMxLCAzNiwgKHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbGF5X25hbWVzW2luZGV4XSA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICBSZWxheS5DcmVhdGVXaXRoUHJvcGVydHkobWFuYWdlci5yZWxheXMsIGluZGV4LCBSZWxheUluZGV4ZXMuVEVYVCwgdmFyaWFibGUsIG1hbmFnZXIpO1xyXG4gICAgICAgIH0sIHRydWUpLFxyXG4gICAgICAgIG5ldyBTaGFyZWRSYW5nZShcIlRcIiwgNDEsIDQ4LCAodmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5hbG9nX25hbWVzW2luZGV4XSA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICBTZW5zb3IuQ3JlYXRlV2l0aFByb3BlcnR5KHRoaXMuYW5hbG9nLCBpbmRleCwgMCwgdmFyaWFibGUsIG1hbmFnZXIsIFNlbnNvclR5cGUuQU5BTE9HKTtcclxuICAgICAgICB9LCB0cnVlKSxcclxuXHJcbiAgICAgICAgbmV3IFNoYXJlZFJhbmdlKFwiVVwiLCAxMCwgMTAsICh2YXJpYWJsZTogU2hhcmVkVmFyaWFibGUsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50aW1lVmFyID0gdmFyaWFibGU7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgbmV3IFNoYXJlZFJhbmdlKFwiVVwiLCAxMSwgMTYsICh2YXJpYWJsZTogU2hhcmVkVmFyaWFibGUsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZWxheV9zdGF0ZXNbaW5kZXhdID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgIFJlbGF5LkNyZWF0ZVdpdGhQcm9wZXJ0eShtYW5hZ2VyLnJlbGF5cywgaW5kZXgsIFJlbGF5SW5kZXhlcy5TVEFURSwgdmFyaWFibGUsIG1hbmFnZXIpO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIG5ldyBTaGFyZWRSYW5nZShcIlVcIiwgMjEsIDYwLCAodmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucnVsZV9pbmZvX3Jhd1tpbmRleF0gPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgUnVsZS5DcmVhdGVXaXRoUHJvcGVydHkobWFuYWdlci5ydWxlcywgTWF0aC5mbG9vcihpbmRleCAvIDQpLCAoaW5kZXggJSA0KSArIDIsIHZhcmlhYmxlLCBtYW5hZ2VyKTtcclxuICAgICAgICB9LCB0cnVlKSxcclxuICAgICAgICBuZXcgU2hhcmVkUmFuZ2UoXCJVXCIsIDcwLCA3NSwgKHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbGF5X3J1bGVfaW5kZXhbaW5kZXhdID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgIFJlbGF5LkNyZWF0ZVdpdGhQcm9wZXJ0eShtYW5hZ2VyLnJlbGF5cywgaW5kZXgsIFJlbGF5SW5kZXhlcy5SVUxFLCB2YXJpYWJsZSwgbWFuYWdlcik7XHJcbiAgICAgICAgfSwgdHJ1ZSksXHJcblxyXG4gICAgICAgIG5ldyBTaGFyZWRSYW5nZShcIlNcIiwgMTEsIDE4LCAodmFyaWFibGU6IFNoYXJlZFZhcmlhYmxlLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVzX2FfcmF3W2luZGV4XSA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICBTZW5zb3IuQ3JlYXRlV2l0aFByb3BlcnR5KHRoaXMuYnVzX2EsIE1hdGguZmxvb3IoaW5kZXggLyAyKSwgKGluZGV4ICUgMikgKyAxLCB2YXJpYWJsZSwgbWFuYWdlcik7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgbmV3IFNoYXJlZFJhbmdlKFwiU1wiLCAyMSwgMjgsICh2YXJpYWJsZTogU2hhcmVkVmFyaWFibGUsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5idXNfYl9yYXdbaW5kZXhdID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgIFNlbnNvci5DcmVhdGVXaXRoUHJvcGVydHkodGhpcy5idXNfYiwgTWF0aC5mbG9vcihpbmRleCAvIDIpLCAoaW5kZXggJSAyKSArIDEsIHZhcmlhYmxlLCBtYW5hZ2VyKTtcclxuICAgICAgICB9KSxcclxuICAgICAgICBuZXcgU2hhcmVkUmFuZ2UoXCJTXCIsIDMxLCA1MCwgKHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJ1bGVfcmFuZ2VfcmF3W2luZGV4XSA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICBSdWxlLkNyZWF0ZVdpdGhQcm9wZXJ0eShtYW5hZ2VyLnJ1bGVzLCBNYXRoLmZsb29yKGluZGV4IC8gMiksIChpbmRleCAlIDIpLCB2YXJpYWJsZSwgbWFuYWdlcik7XHJcbiAgICAgICAgfSwgdHJ1ZSksXHJcbiAgICAgICAgbmV3IFNoYXJlZFJhbmdlKFwiU1wiLCA2MCwgNzUsICh2YXJpYWJsZTogU2hhcmVkVmFyaWFibGUsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hbmFsb2dfcmF3W2luZGV4XSA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICBTZW5zb3IuQ3JlYXRlV2l0aFByb3BlcnR5KHRoaXMuYW5hbG9nLCBNYXRoLmZsb29yKGluZGV4IC8gMiksIChpbmRleCAlIDIpICsgMSwgdmFyaWFibGUsIG1hbmFnZXIsIFNlbnNvclR5cGUuQU5BTE9HKTtcclxuICAgICAgICB9KSxcclxuICAgIF07XHJcbiAgICB1cGRhdGVJbnRlcnZhbDogbnVtYmVyO1xyXG4gICAgYXR0YWNoZXI6IEF0dGFjaGVyO1xyXG5cclxuICAgIGxvYWRlZCA9IGZhbHNlO1xyXG4gICAgZmlyc3RVcGRhdGVFdmVudCA9IG5ldyBDdXN0b21FdmVudChcImZpcnN0VXBkYXRlXCIpO1xyXG4gICAgdXBkYXRlRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJ1cGRhdGVcIik7XHJcblxyXG5cclxuXHJcbiAgICBzaGFyZWQ6IHsgW2lkOiBzdHJpbmddOiBTaGFyZWRWYXJpYWJsZSB9ID0ge307XHJcblxyXG4gICAgdGltZVZhcjogU2hhcmVkVmFyaWFibGU7XHJcblxyXG4gICAgc2Vuc29yczogU2Vuc29yW10gPSBbXTtcclxuXHJcbiAgICBidXNfYTogU2Vuc29yW10gPSBbXTtcclxuICAgIGJ1c19hX3JhdzogU2hhcmVkVmFyaWFibGVbXSA9IFtdO1xyXG4gICAgYnVzX2FfbmFtZXM6IFNoYXJlZFZhcmlhYmxlW10gPSBbXTtcclxuICAgIGJ1c19iOiBTZW5zb3JbXSA9IFtdO1xyXG4gICAgYnVzX2JfcmF3OiBTaGFyZWRWYXJpYWJsZVtdID0gW107XHJcbiAgICBidXNfYl9uYW1lczogU2hhcmVkVmFyaWFibGVbXSA9IFtdO1xyXG5cclxuICAgIHJ1bGVzOiBSdWxlW10gPSBbXTtcclxuICAgIHJ1bGVfcmFuZ2VfcmF3OiBTaGFyZWRWYXJpYWJsZVtdID0gW107XHJcbiAgICBydWxlX2luZm9fcmF3OiBTaGFyZWRWYXJpYWJsZVtdID0gW107XHJcbiAgICBydWxlX25hbWVzOiBTaGFyZWRWYXJpYWJsZVtdID0gW107XHJcblxyXG4gICAgcmVsYXlzOiBSZWxheVtdID0gW107XHJcbiAgICByZWxheV9zdGF0ZXM6IFNoYXJlZFZhcmlhYmxlW10gPSBbXTtcclxuICAgIHJlbGF5X3J1bGVfaW5kZXg6IFNoYXJlZFZhcmlhYmxlW10gPSBbXTtcclxuICAgIHJlbGF5X25hbWVzOiBTaGFyZWRWYXJpYWJsZVtdID0gW107XHJcblxyXG4gICAgYW5hbG9nX25hbWVzOiBTaGFyZWRWYXJpYWJsZVtdID0gW107XHJcbiAgICBhbmFsb2dfcmF3OiBTaGFyZWRWYXJpYWJsZVtdID0gW107XHJcbiAgICBhbmFsb2c6IFNlbnNvcltdID0gW107XHJcblxyXG4gICAgZHJhZ0FuZERyb3A6IHsgW2lkOiBzdHJpbmddOiBJRHJhZ0FuZERyb3AgfSA9IHt9O1xyXG5cclxuICAgIGxhc3REcmFnQ2xhc3MgPSBcIlwiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgbWFuYWdlciA9IHRoaXM7XHJcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLm1hbmFnZXIgPSB0aGlzO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpZCA9ICg8RWxlbWVudD5lLnRhcmdldCkuaWQ7XHJcbiAgICAgICAgICAgIGxldCB0eXBlID0gXCJ0ZXh0L1wiICsgdGhpcy5kcmFnQW5kRHJvcFtpZF0uZ2V0VHlwZSgpO1xyXG4gICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5pdGVtcy5hZGQoaWQsIHR5cGUpO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3REcmFnQ2xhc3MgPSBcImRyYWctXCIgKyB0aGlzLmRyYWdBbmREcm9wW2lkXS5nZXRUeXBlKCk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXS5jbGFzc0xpc3QuYWRkKHRoaXMubGFzdERyYWdDbGFzcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSAoPEVsZW1lbnQ+ZS50YXJnZXQpO1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0SWQgPSBlbGVtZW50LmlkO1xyXG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCAmJiAhdGFyZ2V0SWQpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGVsZW1lbnQuaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBlLmRhdGFUcmFuc2Zlci5pdGVtc1swXTtcclxuICAgICAgICAgICAgbGV0IHRhcmdldCA9IDxFbGVtZW50PmUudGFyZ2V0O1xyXG4gICAgICAgICAgICBpdGVtLmdldEFzU3RyaW5nKChvcmlnaW5JZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnQW5kRHJvcFt0YXJnZXRJZF0uaGFuZGxlRHJvcCh0aGlzLmRyYWdBbmREcm9wW29yaWdpbklkXSwgdGFyZ2V0KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VuZFwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmxhc3REcmFnQ2xhc3MpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJmaXJzdFVwZGF0ZVwiLCB0aGlzLmZpcnN0VXBkYXRlSGFuZGxlcik7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZW5kU2hhcmVkV3JpdGVSZXF1ZXN0KGRhdGE6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXEub3BlbihcIkdFVFwiLCBcImh0dHA6Ly8xOTIuMTY4LjEuMTMzL3N2P1wiICsgZGF0YSk7XHJcbiAgICAgICAgcmVxLnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzYXZlKHRhcmdldDogU2F2ZVRhcmdldCA9IFNhdmVUYXJnZXQuQUxMKSB7XHJcbiAgICAgICAgc3dpdGNoICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY2FzZSBTYXZlVGFyZ2V0LkFMTDpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZShTYXZlVGFyZ2V0LlNFTlNPUik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmUoU2F2ZVRhcmdldC5SVUxFKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZShTYXZlVGFyZ2V0LlJFTEFZKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNoYXJlZFdyaXRlUmVxdWVzdChcIlU5OD0xXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIFNhdmVUYXJnZXQuU0VOU09SOlxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzZW5zb3Igb2YgdGhpcy5zZW5zb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU2hhcmVkV3JpdGVSZXF1ZXN0KHNlbnNvci5nZXRVcmxTZXR0ZXIoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgU2F2ZVRhcmdldC5SVUxFOlxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBydWxlIG9mIHRoaXMucnVsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTaGFyZWRXcml0ZVJlcXVlc3QocnVsZS5nZXRVcmxTZXR0ZXIoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgU2F2ZVRhcmdldC5SRUxBWTpcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcmVsYXkgb2YgdGhpcy5yZWxheXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTaGFyZWRXcml0ZVJlcXVlc3QocmVsYXkuZ2V0VXJsU2V0dGVyKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgbGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGxldCByZXNwb25zZUFyciA9IHJlcS5yZXNwb25zZVRleHQuc3BsaXQoXCJ8XCIpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3BvbnNlQXJyLmxlbmd0aDsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBtYW5hZ2VyLmhhbmRsZVNoYXJlZFZhcihyZXNwb25zZUFycltpXSwgcmVzcG9uc2VBcnJbaSArIDFdKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIW1hbmFnZXIubG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBtYW5hZ2VyLmRpc3BhdGNoRXZlbnQobWFuYWdlci5maXJzdFVwZGF0ZUV2ZW50KTtcclxuICAgICAgICAgICAgICAgIG1hbmFnZXIubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1hbmFnZXIuZGlzcGF0Y2hFdmVudChtYW5hZ2VyLnVwZGF0ZUV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVxLm9wZW4oXCJHRVRcIiwgXCJodHRwOi8vMTkyLjE2OC4xLjEzMy9zaGFyZWQudHh0XCIpO1xyXG4gICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBoYW5kbGVyKTtcclxuICAgICAgICByZXEuc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVNoYXJlZFZhcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAobmFtZS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB2YWw6IHN0cmluZyB8IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IHNoYXJlZFZhciA9IHRoaXMuc2hhcmVkW25hbWVdO1xyXG4gICAgICAgIGlmIChzaGFyZWRWYXIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzaGFyZWRWYXIgPSBuZXcgU2hhcmVkVmFyaWFibGUobmFtZSwgdmFsKTtcclxuICAgICAgICAgICAgdGhpcy5zaGFyZWRbbmFtZV0gPSBzaGFyZWRWYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc2hhcmVkVmFyLnJlYWxUaW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3dpdGNoIChuYW1lWzBdKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1XCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJTXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJVXCI6XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlRcIjpcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHZhbCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYXJlZFZhci52YWx1ZSA9IHZhbDtcclxuICAgICAgICByZXR1cm4gc2hhcmVkVmFyO1xyXG4gICAgfVxyXG5cclxuICAgIGZpcnN0VXBkYXRlSGFuZGxlcigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnNoYXJlZCkge1xyXG4gICAgICAgICAgICBsZXQgdmFyaWFibGUgPSB0aGlzLnNoYXJlZFtrZXldO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJhbmdlIG9mIHRoaXMuc2hhcmVkUmFuZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICByYW5nZS5oYW5kbGVTaGFyZWRWYXIodmFyaWFibGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNlbnNvcnMgPSB0aGlzLnNlbnNvcnMuY29uY2F0KHRoaXMuYnVzX2EsIHRoaXMuYnVzX2IsIHRoaXMuYW5hbG9nKTtcclxuICAgICAgICBmb3IgKGxldCBpdGVtIG9mICg8SURyYWdBbmREcm9wW10+dGhpcy5ydWxlcykuY29uY2F0KHRoaXMuc2Vuc29ycywgdGhpcy5yZWxheXMpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ0FuZERyb3BbaXRlbS5pZF0gPSBpdGVtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hdHRhY2hlciA9IG5ldyBBdHRhY2hlcihtYW5hZ2VyKTtcclxuXHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgbWFuYWdlci51cGRhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKG1hbmFnZXIudXBkYXRlLCAxMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZW5zb3IoaW5kZXg6IG51bWJlcik6IFNlbnNvciB7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgdGhpcy5idXNfYS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVzX2FbaW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKGluZGV4IC09IHRoaXMuYnVzX2EubGVuZ3RoKSA8IHRoaXMuYnVzX2IubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1c19iW2luZGV4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5hbG9nW2luZGV4IC0gdGhpcy5idXNfYi5sZW5ndGhdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNlbnNvclJlbGF0aXZlSW5kZXgoc2Vuc29yOiBTZW5zb3IpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5idXNfYS5pbmRleE9mKHNlbnNvcik7XHJcblxyXG4gICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xyXG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuYnVzX2IuaW5kZXhPZihzZW5zb3IpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gdGhpcy5hbmFsb2cuaW5kZXhPZihzZW5zb3IpICsgdGhpcy5idXNfYS5sZW5ndGggKyB0aGlzLmJ1c19iLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ICs9IHRoaXMuYnVzX2EubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbmRleDtcclxuICAgIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHsgYWRkUmVsYXRpdmVDYWxsYmFjaywgdXVpZHY0IH0gZnJvbSBcIi4vSGVscGVyXCI7XHJcbmltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9NYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVhbHRpbWUge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHRhcmdldDogRXZlbnRUYXJnZXQpIHtcclxuICAgICAgICBhZGRSZWxhdGl2ZUNhbGxiYWNrKHRhcmdldCwgXCJ1cGRhdGVcIiwgdGhpcywgKHgpID0+IHgudXBkYXRlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmlkID0gdXVpZHY0KCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVIYW5kbGVyKCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgZW5hYmxlRHJvcCB9IGZyb20gXCIuL0hlbHBlclwiO1xyXG5pbXBvcnQgeyBJRHJhZ0FuZERyb3AgfSBmcm9tIFwiLi9JRHJhZ0FuZERyb3BcIjtcclxuaW1wb3J0IHsgSVNhdmVhYmxlIH0gZnJvbSBcIi4vSVNhdmVhYmxlXCI7XHJcbmltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9NYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFJlYWx0aW1lIH0gZnJvbSBcIi4vUmVhbHRpbWVcIjtcclxuaW1wb3J0IHsgUnVsZSB9IGZyb20gXCIuL1J1bGVcIjtcclxuaW1wb3J0IHsgU2hhcmVkVmFyaWFibGUgfSBmcm9tIFwiLi9TaGFyZWRWYXJpYWJsZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlbGF5IGV4dGVuZHMgUmVhbHRpbWUgaW1wbGVtZW50cyBJU2F2ZWFibGUsIElEcmFnQW5kRHJvcCB7XHJcbiAgICAvLyNyZWdpb24gcnVsZVxyXG4gICAgZ2V0IHJ1bGUoKTogUnVsZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5ydWxlc1s8bnVtYmVyPnRoaXMucnVsZUluZGV4VmFyLnZhbHVlXTtcclxuICAgIH1cclxuICAgIHNldCBydWxlKHJ1bGU6IFJ1bGUpIHtcclxuICAgICAgICB0aGlzLnJ1bGVJbmRleFZhci52YWx1ZSA9IHRoaXMubWFuYWdlci5ydWxlcy5pbmRleE9mKHJ1bGUpO1xyXG4gICAgICAgIGlmICh0aGlzLnJ1bGVJbmRleFZhci52YWx1ZSA9PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnJ1bGVJbmRleFZhci52YWx1ZSA9IDB4N0ZGRkZGRkY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJ1bGVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJ1bGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucnVsZUVsZW1lbnQudmFsdWUgPSBydWxlLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bGVFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBuYW1lXHJcbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVWYXIudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIHNldCBuYW1lKHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubmFtZVZhci52YWx1ZSA9IHRleHQ7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBuYW1lRWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHJ1bGVFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgX2VsZW1lbnQ6IEVsZW1lbnQ7XHJcbiAgICBnZXQgZWxlbWVudCgpOiBFbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcclxuICAgIH1cclxuICAgIHNldCBlbGVtZW50KGVsOiBFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGVsO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5pZCA9IHRoaXMuaWQ7XHJcblxyXG4gICAgICAgIHRoaXMucnVsZUVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD50aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInJlbGF5LXJ1bGVcIilbMV07XHJcbiAgICAgICAgdGhpcy5uYW1lRWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicmVsYXktbmFtZVwiKVsxXTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnV0dG9uXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnJ1bGUgPSB1bmRlZmluZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnJ1bGUgPSB0aGlzLnJ1bGU7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZVZhci5iaW5kVGV4dCh0aGlzLm5hbWVFbGVtZW50KTtcclxuXHJcbiAgICAgICAgZW5hYmxlRHJvcCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lVmFyOiBTaGFyZWRWYXJpYWJsZSwgcHVibGljIHJ1bGVJbmRleFZhcjogU2hhcmVkVmFyaWFibGUsIHB1YmxpYyBzdGF0ZVZhcjogU2hhcmVkVmFyaWFibGUsIHB1YmxpYyBtYW5hZ2VyOiBNYW5hZ2VyKSB7XHJcbiAgICAgICAgc3VwZXIobWFuYWdlcik7XHJcbiAgICB9XHJcbiAgICBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwicmVsYXlcIjtcclxuICAgIH1cclxuICAgIGhhbmRsZURyb3Aob2JqOiBJRHJhZ0FuZERyb3AsIHRhcmdldDogRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChvYmouZ2V0VHlwZSgpICE9IFwicnVsZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJ1bGU6IFJ1bGUgPSA8UnVsZT5vYmo7XHJcbiAgICAgICAgdGhpcy5ydWxlID0gcnVsZTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUhhbmRsZXIoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldFVybFNldHRlcigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVWYXIuZ2V0VXJsU2V0dGVyKCkgKyBcIiZcIiArIHRoaXMucnVsZUluZGV4VmFyLmdldFVybFNldHRlcigpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIENyZWF0ZVdpdGhQcm9wZXJ0eShhcnJheTogUmVsYXlbXSwgYXJyYXlJbmRleDogbnVtYmVyLCBwcm9wZXJ0eUluZGV4OiBudW1iZXIsIHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSwgbWFuYWdlcjogTWFuYWdlcik6IFJlbGF5IHtcclxuICAgICAgICBsZXQgcmVsYXkgPSBhcnJheVthcnJheUluZGV4XTtcclxuICAgICAgICBpZiAocmVsYXkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZWxheSA9IGFycmF5W2FycmF5SW5kZXhdID0gbmV3IFJlbGF5KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG1hbmFnZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKHByb3BlcnR5SW5kZXggJSAzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHJlbGF5Lm5hbWVWYXIgPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICByZWxheS5ydWxlSW5kZXhWYXIgPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICByZWxheS5zdGF0ZVZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlbGF5O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVsZVR5cGUgfSBmcm9tIFwiLi9FbnVtc1wiO1xyXG5pbXBvcnQgeyBhZGRSZWxhdGl2ZUNhbGxiYWNrLCBjcmVhdGVEcmFnVGFyZ2V0LCBlbmFibGVEcm9wLCBzZWNvbmRzVG9EYXRlIH0gZnJvbSBcIi4vSGVscGVyXCI7XHJcbmltcG9ydCB7IElEcmFnQW5kRHJvcCB9IGZyb20gXCIuL0lEcmFnQW5kRHJvcFwiO1xyXG5pbXBvcnQgeyBJU2F2ZWFibGUgfSBmcm9tIFwiLi9JU2F2ZWFibGVcIjtcclxuaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL01hbmFnZXJcIjtcclxuaW1wb3J0IHsgUmVhbHRpbWUgfSBmcm9tIFwiLi9SZWFsdGltZVwiO1xyXG5pbXBvcnQgeyBTZW5zb3IgfSBmcm9tIFwiLi9TZW5zb3JcIjtcclxuaW1wb3J0IHsgU2hhcmVkVmFyaWFibGUgfSBmcm9tIFwiLi9TaGFyZWRWYXJpYWJsZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBSZWFsdGltZSBpbXBsZW1lbnRzIElTYXZlYWJsZSwgSURyYWdBbmREcm9wIHtcclxuICAgIC8vI3JlZ2lvbiBuYW1lXHJcbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVWYXIudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIHNldCBuYW1lKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm5hbWVWYXIudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBzdGFydFxyXG4gICAgZ2V0IHN0YXJ0KCk6IHN0cmluZyB8IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRWYXIudmFsdWU7XHJcbiAgICB9XHJcbiAgICBzZXQgc3RhcnQoczogc3RyaW5nIHwgbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFZhci52YWx1ZSA9IHM7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gZW5kXHJcbiAgICBnZXQgZW5kKCk6IHN0cmluZyB8IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5kVmFyLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgc2V0IGVuZChzOiBzdHJpbmcgfCBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmVuZFZhci52YWx1ZSA9IHM7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gdHlwZVxyXG4gICAgZ2V0IHR5cGUoKTogUnVsZVR5cGUge1xyXG4gICAgICAgIHJldHVybiA8bnVtYmVyPnRoaXMudHlwZVZhci52YWx1ZTtcclxuICAgIH1cclxuICAgIHNldCB0eXBlKHR5cGU6IFJ1bGVUeXBlKSB7XHJcbiAgICAgICAgdGhpcy50eXBlVmFyLnZhbHVlID0gdHlwZTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiB0YXJnZXRcclxuICAgIGdldCB0YXJnZXQoKTogU2Vuc29yIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLmdldFNlbnNvcig8bnVtYmVyPnRoaXMudGFyZ2V0VmFyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIHNldCB0YXJnZXQoc2Vuc29yOiBTZW5zb3IpIHtcclxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLm1hbmFnZXIuZ2V0U2Vuc29yUmVsYXRpdmVJbmRleChzZW5zb3IpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldFZhci52YWx1ZSA9IGluZGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zZW5zb3JFbGVtZW50ICYmIHNlbnNvcikge1xyXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5zZW5zb3JFbGVtZW50KS52YWx1ZSA9IHNlbnNvci5tYWluTmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gc3ViUnVsZUFcclxuICAgIGdldCBzdWJSdWxlQSgpOiBSdWxlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLnJ1bGVzWzxudW1iZXI+dGhpcy5zdWJSdWxlQVZhci52YWx1ZV07XHJcbiAgICB9XHJcbiAgICBzZXQgc3ViUnVsZUEocnVsZTogUnVsZSkge1xyXG4gICAgICAgIHRoaXMuc3ViUnVsZUFWYXIudmFsdWUgPSB0aGlzLm1hbmFnZXIucnVsZXMuaW5kZXhPZihydWxlKTtcclxuICAgICAgICBpZiAodGhpcy5zdWJSdWxlQVZhci52YWx1ZSA9PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1YlJ1bGVBVmFyLnZhbHVlID0gMHg3RkZGRkZGRjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc3ViUnVsZUFFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1YlJ1bGVBKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1YlJ1bGVBRWxlbWVudC52YWx1ZSA9IHRoaXMuc3ViUnVsZUEubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3ViUnVsZUFFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBzdWJSdWxlQlxyXG4gICAgZ2V0IHN1YlJ1bGVCKCk6IFJ1bGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIucnVsZXNbPG51bWJlcj50aGlzLnN1YlJ1bGVCVmFyLnZhbHVlXTtcclxuICAgIH1cclxuICAgIHNldCBzdWJSdWxlQihydWxlOiBSdWxlKSB7XHJcbiAgICAgICAgdGhpcy5zdWJSdWxlQlZhci52YWx1ZSA9IHRoaXMubWFuYWdlci5ydWxlcy5pbmRleE9mKHJ1bGUpO1xyXG4gICAgICAgIGlmICh0aGlzLnN1YlJ1bGVCVmFyLnZhbHVlID09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3ViUnVsZUJWYXIudmFsdWUgPSAweDdGRkZGRkZGO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zdWJSdWxlQkVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3ViUnVsZUIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3ViUnVsZUJFbGVtZW50LnZhbHVlID0gdGhpcy5zdWJSdWxlQi5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWJSdWxlQkVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBuYW1lVmFyOiBTaGFyZWRWYXJpYWJsZSxcclxuICAgICAgICBwcml2YXRlIHN0YXJ0VmFyOiBTaGFyZWRWYXJpYWJsZSxcclxuICAgICAgICBwcml2YXRlIGVuZFZhcjogU2hhcmVkVmFyaWFibGUsXHJcbiAgICAgICAgcHJpdmF0ZSB0eXBlVmFyOiBTaGFyZWRWYXJpYWJsZSxcclxuICAgICAgICBwcml2YXRlIHRhcmdldFZhcjogU2hhcmVkVmFyaWFibGUsXHJcbiAgICAgICAgcHJpdmF0ZSBzdWJSdWxlQVZhcjogU2hhcmVkVmFyaWFibGUsXHJcbiAgICAgICAgcHJpdmF0ZSBzdWJSdWxlQlZhcjogU2hhcmVkVmFyaWFibGUsXHJcbiAgICAgICAgcHJpdmF0ZSBtYW5hZ2VyOiBNYW5hZ2VyXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihtYW5hZ2VyKTtcclxuICAgIH1cclxuICAgIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJydWxlXCI7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVEcm9wKG9iajogSURyYWdBbmREcm9wLCB0YXJnZXQ6IEVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2ggKG9iai5nZXRUeXBlKCkpIHtcclxuICAgICAgICAgICAgY2FzZSBcInNlbnNvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQgPSA8U2Vuc29yPjxhbnk+b2JqO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJydWxlXCI6XHJcbiAgICAgICAgICAgICAgICBsZXQgYUluZGV4ID0gdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInJ1bGUtYVwiKTtcclxuICAgICAgICAgICAgICAgIGxldCBiSW5kZXggPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwicnVsZS1iXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFJbmRleCkgdGhpcy5zdWJSdWxlQSA9IDxSdWxlPm9iajtcclxuICAgICAgICAgICAgICAgIGlmIChiSW5kZXgpIHRoaXMuc3ViUnVsZUIgPSA8UnVsZT5vYmo7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBDcmVhdGVXaXRoUHJvcGVydHkoYXJyYXk6IFJ1bGVbXSwgYXJyYXlJbmRleDogbnVtYmVyLCBwcm9wZXJ0eUluZGV4OiBudW1iZXIsIHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSwgbWFuYWdlcjogTWFuYWdlcik6IFJ1bGUge1xyXG4gICAgICAgIGxldCBydWxlID0gYXJyYXlbYXJyYXlJbmRleF07XHJcbiAgICAgICAgaWYgKHJ1bGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBydWxlID0gYXJyYXlbYXJyYXlJbmRleF0gPSBuZXcgUnVsZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG1hbmFnZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKHByb3BlcnR5SW5kZXggJSA3KSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHJ1bGUuc3RhcnRWYXIgPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBydWxlLmVuZFZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIHJ1bGUudHlwZVZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJ1bGUudGFyZ2V0VmFyID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgcnVsZS5zdWJSdWxlQVZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgICAgIHJ1bGUuc3ViUnVsZUJWYXIgPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDY6XHJcbiAgICAgICAgICAgICAgICBydWxlLm5hbWVWYXIgPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBydWxlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnQ7XHJcbiAgICBnZXQgZWxlbWVudCgpOiBFbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcclxuICAgIH1cclxuICAgIHNldCBlbGVtZW50KGVsOiBFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGVsO1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5pZCA9IHRoaXMuaWQ7XHJcbiAgICAgICAgdGhpcy5uYW1lRWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicnVsZS1uYW1lXCIpWzFdO1xyXG4gICAgICAgIHRoaXMuc3RhcnRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJydWxlLXN0YXJ0XCIpWzFdO1xyXG4gICAgICAgIHRoaXMuZW5kRWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicnVsZS1lbmRcIilbMV07XHJcbiAgICAgICAgdGhpcy5zZW5zb3JFbGVtZW50ID0gdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJydWxlLXNlbnNvclwiKVsxXTtcclxuICAgICAgICB0aGlzLnNlbnNvclR5cGVFbGVtZW50ID0gPEhUTUxTZWxlY3RFbGVtZW50PnRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicnVsZS1zZW5zb3ItdHlwZVwiKVsxXTtcclxuICAgICAgICB0aGlzLnN1YlJ1bGVBRWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicnVsZS1hXCIpWzFdO1xyXG4gICAgICAgIHRoaXMuc3ViUnVsZUJFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJydWxlLWJcIilbMV07XHJcblxyXG4gICAgICAgIHRoaXMuc3ViUnVsZUFDbGVhckJ1dHRvbiA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicnVsZS1hXCIpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnV0dG9uXCIpWzBdO1xyXG4gICAgICAgIHRoaXMuc3ViUnVsZUJDbGVhckJ1dHRvbiA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicnVsZS1iXCIpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnV0dG9uXCIpWzBdO1xyXG5cclxuICAgICAgICB0aGlzLnN1YlJ1bGVBQ2xlYXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuc3ViUnVsZUEgPSB1bmRlZmluZWQpO1xyXG4gICAgICAgIHRoaXMuc3ViUnVsZUJDbGVhckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zdWJSdWxlQiA9IHVuZGVmaW5lZCk7XHJcblxyXG4gICAgICAgIHRoaXMudHlwZVZhci5iaW5kU2VsZWN0KHRoaXMuc2Vuc29yVHlwZUVsZW1lbnQsICgpID0+IHsgdGhpcy51cGRhdGVTdHlsZSgpIH0pO1xyXG4gICAgICAgIHRoaXMubmFtZVZhci5iaW5kVGV4dCh0aGlzLm5hbWVFbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0aGlzLnRhcmdldDtcclxuICAgICAgICB0aGlzLnN1YlJ1bGVBID0gdGhpcy5zdWJSdWxlQTtcclxuICAgICAgICB0aGlzLnN1YlJ1bGVCID0gdGhpcy5zdWJSdWxlQjtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTdHlsZSgpO1xyXG5cclxuICAgICAgICBlbmFibGVEcm9wKHRoaXMuZWxlbWVudCk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgbmFtZUVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBzdGFydEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBlbmRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgc2Vuc29yRWxlbWVudDogRWxlbWVudDtcclxuICAgIHNlbnNvclR5cGVFbGVtZW50OiBIVE1MU2VsZWN0RWxlbWVudDtcclxuICAgIHN1YlJ1bGVBRWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHN1YlJ1bGVCRWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHN1YlJ1bGVBQ2xlYXJCdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgc3ViUnVsZUJDbGVhckJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICB1cGRhdGVIYW5kbGVyKCkgeyB9XHJcblxyXG4gICAgX3ByZXZUeXBlOiBSdWxlVHlwZSA9IDA7XHJcbiAgICB1cGRhdGVTdHlsZSgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShSdWxlVHlwZVt0aGlzLl9wcmV2VHlwZV0pO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFJ1bGVUeXBlW3RoaXMudHlwZV0pO1xyXG4gICAgICAgIHRoaXMuX3ByZXZUeXBlID0gdGhpcy50eXBlO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFJ1bGVUeXBlLkJVU19NQUlOOlxyXG4gICAgICAgICAgICBjYXNlIFJ1bGVUeXBlLkJVU19NSVNDOlxyXG4gICAgICAgICAgICBjYXNlIFJ1bGVUeXBlLkNQV006XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RWxlbWVudC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZEVsZW1lbnQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEVsZW1lbnQudmFsdWUgPSB0aGlzLnN0YXJ0LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZEVsZW1lbnQudmFsdWUgPSB0aGlzLmVuZC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUnVsZVR5cGUuVElNRTpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRFbGVtZW50LnR5cGUgPSBcInRpbWVcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRWxlbWVudC50eXBlID0gXCJ0aW1lXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RWxlbWVudC52YWx1ZSA9IHNlY29uZHNUb0RhdGUoPG51bWJlcj50aGlzLnN0YXJ0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRWxlbWVudC52YWx1ZSA9IHNlY29uZHNUb0RhdGUoPG51bWJlcj50aGlzLmVuZCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXJsU2V0dGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdGhpcy5zdGFydFZhci5zZXQodGhpcy5zdGFydEVsZW1lbnQudmFsdWUsIHRoaXMudHlwZSk7XHJcbiAgICAgICAgdGhpcy5lbmRWYXIuc2V0KHRoaXMuZW5kRWxlbWVudC52YWx1ZSwgdGhpcy50eXBlKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLm5hbWVWYXIuZ2V0VXJsU2V0dGVyKCkgK1xyXG4gICAgICAgICAgICBcIiZcIiArXHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRWYXIuZ2V0VXJsU2V0dGVyKCkgK1xyXG4gICAgICAgICAgICBcIiZcIiArXHJcbiAgICAgICAgICAgIHRoaXMuZW5kVmFyLmdldFVybFNldHRlcigpICtcclxuICAgICAgICAgICAgXCImXCIgK1xyXG4gICAgICAgICAgICB0aGlzLnR5cGVWYXIuZ2V0VXJsU2V0dGVyKCkgK1xyXG4gICAgICAgICAgICBcIiZcIiArXHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0VmFyLmdldFVybFNldHRlcigpICtcclxuICAgICAgICAgICAgXCImXCIgK1xyXG4gICAgICAgICAgICB0aGlzLnN1YlJ1bGVBVmFyLmdldFVybFNldHRlcigpICtcclxuICAgICAgICAgICAgXCImXCIgK1xyXG4gICAgICAgICAgICB0aGlzLnN1YlJ1bGVCVmFyLmdldFVybFNldHRlcigpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhZGRSZWxhdGl2ZUNhbGxiYWNrLCBjcmVhdGVEcmFnVGFyZ2V0LCB1dWlkdjQgfSBmcm9tIFwiLi9IZWxwZXJcIjtcclxuaW1wb3J0IHsgSURyYWdBbmREcm9wIH0gZnJvbSBcIi4vSURyYWdBbmREcm9wXCI7XHJcbmltcG9ydCB7IElTYXZlYWJsZSB9IGZyb20gXCIuL0lTYXZlYWJsZVwiO1xyXG5pbXBvcnQgeyBNYW5hZ2VyIH0gZnJvbSBcIi4vTWFuYWdlclwiO1xyXG5pbXBvcnQgeyBSZWFsdGltZSB9IGZyb20gXCIuL1JlYWx0aW1lXCI7XHJcbmltcG9ydCB7IFNoYXJlZFZhcmlhYmxlIH0gZnJvbSBcIi4vU2hhcmVkVmFyaWFibGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTZW5zb3IgZXh0ZW5kcyBSZWFsdGltZSBpbXBsZW1lbnRzIElTYXZlYWJsZSwgSURyYWdBbmREcm9wIHtcclxuICAgIC8vI3JlZ2lvbiBtYWluXHJcbiAgICBnZXQgbWFpbigpOiBudW1iZXIgfCBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1haW5WYXIudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gbWlzY1xyXG4gICAgZ2V0IG1pc2MoKTogbnVtYmVyIHwgc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5taXNjVmFyLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIG1haW5OYW1lXHJcbiAgICBnZXQgbWFpbk5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYWluTmFtZVZhci52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgc2V0IG1haW5OYW1lKHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubWFpbk5hbWVWYXIudmFsdWUgPSB0ZXh0O1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgc2Vuc29yTWFpbjogRWxlbWVudDtcclxuICAgIHNlbnNvck1pc2M6IEVsZW1lbnQ7XHJcbiAgICBzZW5zb3JOYW1lOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudDtcclxuICAgIGdldCBlbGVtZW50KCk6IEVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xyXG4gICAgfVxyXG4gICAgc2V0IGVsZW1lbnQoZWw6IEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWw7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmlkID0gdGhpcy5pZDtcclxuICAgICAgICB0aGlzLnNlbnNvck1haW4gPSB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNlbnNvci1tYWluXCIpWzFdO1xyXG4gICAgICAgIHRoaXMuc2Vuc29yTWlzYyA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2Vuc29yLW1pc2NcIilbMV07XHJcbiAgICAgICAgdGhpcy5zZW5zb3JOYW1lID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dC5zZW5zb3ItbmFtZS1tYWluXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLnNlbnNvck5hbWUgJiYgdGhpcy5tYWluTmFtZVZhcikge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBTZW5zb3JUeXBlLkdFTkVSQUw6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYWluTmFtZVZhci5iaW5kVGV4dCh0aGlzLnNlbnNvck5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBTZW5zb3JUeXBlLkFOQUxPRzpcclxuICAgICAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5zZW5zb3JOYW1lKS52YWx1ZSA9IHRoaXMubWFpbk5hbWVWYXIuX3ZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5zb3JOYW1lLnNldEF0dHJpYnV0ZShcInJlYWRvbmx5XCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIG1haW5OYW1lVmFyOiBTaGFyZWRWYXJpYWJsZSxcclxuICAgICAgICBwdWJsaWMgbWlzY05hbWVWYXI6IFNoYXJlZFZhcmlhYmxlLFxyXG4gICAgICAgIHB1YmxpYyBtYWluVmFyOiBTaGFyZWRWYXJpYWJsZSxcclxuICAgICAgICBwdWJsaWMgbWlzY1ZhcjogU2hhcmVkVmFyaWFibGUsXHJcbiAgICAgICAgcHVibGljIG1hbmFnZXI6IE1hbmFnZXIsXHJcbiAgICAgICAgcHVibGljIHR5cGU6IFNlbnNvclR5cGUgPSBTZW5zb3JUeXBlLkdFTkVSQUxcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKG1hbmFnZXIpO1xyXG4gICAgfVxyXG4gICAgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcInNlbnNvclwiO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlRHJvcChvYmo6IElEcmFnQW5kRHJvcCwgdGFyZ2V0OiBFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgQ3JlYXRlV2l0aFByb3BlcnR5KFxyXG4gICAgICAgIGFycmF5OiBTZW5zb3JbXSxcclxuICAgICAgICBhcnJheUluZGV4OiBudW1iZXIsXHJcbiAgICAgICAgcHJvcGVydHlJbmRleDogbnVtYmVyLFxyXG4gICAgICAgIHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSxcclxuICAgICAgICBtYW5hZ2VyOiBNYW5hZ2VyLFxyXG4gICAgICAgIHR5cGU6IFNlbnNvclR5cGUgPSBTZW5zb3JUeXBlLkdFTkVSQUxcclxuICAgICk6IFNlbnNvciB7XHJcbiAgICAgICAgbGV0IHNlbnNvciA9IGFycmF5W2FycmF5SW5kZXhdO1xyXG4gICAgICAgIGlmIChzZW5zb3IgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzZW5zb3IgPSBhcnJheVthcnJheUluZGV4XSA9IG5ldyBTZW5zb3IodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBtYW5hZ2VyLCB0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3dpdGNoIChwcm9wZXJ0eUluZGV4ICUgMykge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBzZW5zb3IubWFpbk5hbWVWYXIgPSB2YXJpYWJsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBzZW5zb3IubWFpblZhciA9IHZhcmlhYmxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIHNlbnNvci5taXNjVmFyID0gdmFyaWFibGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2Vuc29yO1xyXG4gICAgfVxyXG4gICAgZ2V0VXJsU2V0dGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBTZW5zb3JUeXBlLkFOQUxPRykge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJVOTk9MFwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1haW5OYW1lVmFyLmdldFVybFNldHRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2Vuc29yTWFpbiAmJiB0aGlzLm1haW5WYXIpIHRoaXMuc2Vuc29yTWFpbi5pbm5lckhUTUwgPSB0aGlzLm1haW4udG9TdHJpbmcoKTtcclxuICAgICAgICBpZiAodGhpcy5zZW5zb3JNaXNjICYmIHRoaXMubWlzY1ZhcikgdGhpcy5zZW5zb3JNaXNjLmlubmVySFRNTCA9IHRoaXMubWlzYy50b1N0cmluZygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBTZW5zb3JUeXBlIHtcclxuICAgIEdFTkVSQUwsXHJcbiAgICBBTkFMT0csXHJcbn1cclxuIiwiaW1wb3J0IHsgU2hhcmVkVmFyaWFibGUgfSBmcm9tIFwiLi9TaGFyZWRWYXJpYWJsZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNoYXJlZFJhbmdlIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcmVmaXg6c3RyaW5nLHB1YmxpYyBzdGFydDpudW1iZXIscHVibGljIGVuZDpudW1iZXIscHVibGljIGNhbGxiYWNrOkZ1bmN0aW9uLCBwdWJsaWMgb25seU9uY2U6Qm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU2hhcmVkVmFyKHZhcmlhYmxlOiBTaGFyZWRWYXJpYWJsZSkge1xyXG4gICAgICAgIGlmICh2YXJpYWJsZS5uYW1lWzBdID09IHRoaXMucHJlZml4ICYmIHRoaXMuc3RhcnQgPD0gdmFyaWFibGUuaW5kZXggJiYgdmFyaWFibGUuaW5kZXggPD0gdGhpcy5lbmQpIHtcclxuICAgICAgICAgICAgdmFyaWFibGUucmVhbFRpbWUgPSAhdGhpcy5vbmx5T25jZTtcclxuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayh2YXJpYWJsZSwgdmFyaWFibGUuaW5kZXggLSB0aGlzLnN0YXJ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdWxlVHlwZSB9IGZyb20gXCIuL0VudW1zXCI7XHJcbmltcG9ydCB7IGFkZFJlbGF0aXZlQ2FsbGJhY2ssIGRhdGVUb1NlY29uZHMsIHBhZCB9IGZyb20gXCIuL0hlbHBlclwiO1xyXG5pbXBvcnQgeyBJU2F2ZWFibGUgfSBmcm9tIFwiLi9JU2F2ZWFibGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTaGFyZWRWYXJpYWJsZSBpbXBsZW1lbnRzIElTYXZlYWJsZSB7XHJcblx0bmFtZTogc3RyaW5nO1xyXG5cdF92YWx1ZTogc3RyaW5nIHwgbnVtYmVyO1xyXG5cdF90eXBlOiBCaW5kVHlwZTtcclxuXHRnZXQgdmFsdWUoKTogc3RyaW5nIHwgbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl92YWx1ZTtcclxuXHR9XHJcblx0c2V0IHZhbHVlKHZhbDogc3RyaW5nIHwgbnVtYmVyKSB7XHJcblx0XHR0aGlzLl92YWx1ZSA9IHZhbDtcclxuXHRcdGlmICh0aGlzLl90YXJnZXQgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRzd2l0Y2ggKHRoaXMuX3R5cGUpIHtcclxuXHRcdFx0XHRjYXNlIEJpbmRUeXBlLlRleHQ6XHJcblx0XHRcdFx0XHQoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5fdGFyZ2V0KS52YWx1ZSA9IHZhbC50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBCaW5kVHlwZS5TZWxlY3Q6XHJcblx0XHRcdFx0XHQoPEhUTUxTZWxlY3RFbGVtZW50PnRoaXMuX3RhcmdldCkub3B0aW9ucy5zZWxlY3RlZEluZGV4ID0gPG51bWJlcj52YWw7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0aW5kZXg6IG51bWJlcjtcclxuXHRyZWFsVGltZTogQm9vbGVhbiA9IHRydWU7XHJcblx0Y29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdFx0dGhpcy52YWx1ZSA9IHZhbHVlO1xyXG5cdFx0dGhpcy5pbmRleCA9IHBhcnNlSW50KG5hbWUuc2xpY2UoMSkpO1xyXG5cdH1cclxuXHRnZXRVcmxTZXR0ZXIoKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiB0aGlzLm5hbWUgKyBcIj1cIiArIHRoaXMudmFsdWU7XHJcblx0fVxyXG5cdHNldCh2YWw6IHN0cmluZywgdHlwZTogUnVsZVR5cGUpIHtcclxuXHRcdHN3aXRjaCAodHlwZSkge1xyXG5cdFx0XHRjYXNlIFJ1bGVUeXBlLkJVU19NQUlOOlxyXG5cdFx0XHRjYXNlIFJ1bGVUeXBlLkJVU19NSVNDOlxyXG5cdFx0XHRjYXNlIFJ1bGVUeXBlLkNQV006XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUgPSBwYXJzZUludCh2YWwpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFJ1bGVUeXBlLlRJTUU6XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUgPSBkYXRlVG9TZWNvbmRzKHZhbCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdHByaXZhdGUgX3RhcmdldDogRWxlbWVudDtcclxuXHRiaW5kVGV4dCh0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQsIGFjdGlvbjogKCkgPT4gYW55ID0gbnVsbCkge1xyXG5cdFx0dGhpcy5fdHlwZSA9IEJpbmRUeXBlLlRleHQ7XHJcblx0XHR0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHRhZGRSZWxhdGl2ZUNhbGxiYWNrKHRoaXMuX3RhcmdldCwgXCJjaGFuZ2VcIiwgdGhpcywgKHgpID0+IHtcclxuXHRcdFx0eC5fdmFsdWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+eC5fdGFyZ2V0KS52YWx1ZTtcclxuXHRcdFx0aWYgKGFjdGlvbikge1xyXG5cdFx0XHRcdGFjdGlvbigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vVE9ETzogcmVtb3ZlIGRlYnVnXHJcblx0XHRcdGNvbnNvbGUubG9nKHgpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnZhbHVlID0gdGhpcy52YWx1ZTtcclxuXHR9XHJcblx0YmluZFNlbGVjdCh0YXJnZXQ6IEhUTUxTZWxlY3RFbGVtZW50LCBhY3Rpb246ICgpID0+IGFueSA9IG51bGwpIHtcclxuXHRcdHRoaXMuX3R5cGUgPSBCaW5kVHlwZS5TZWxlY3Q7XHJcblx0XHR0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHRhZGRSZWxhdGl2ZUNhbGxiYWNrKHRoaXMuX3RhcmdldCwgXCJjaGFuZ2VcIiwgdGhpcywgKHgpID0+IHtcclxuXHRcdFx0eC5fdmFsdWUgPSAoPEhUTUxTZWxlY3RFbGVtZW50PnguX3RhcmdldCkub3B0aW9ucy5zZWxlY3RlZEluZGV4O1xyXG5cdFx0XHRpZiAoYWN0aW9uKSB7XHJcblx0XHRcdFx0YWN0aW9uKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9UT0RPOiByZW1vdmUgZGVidWdcclxuXHRcdFx0Y29uc29sZS5sb2coeCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xyXG5cdH1cclxufVxyXG5cclxuZW51bSBCaW5kVHlwZSB7XHJcblx0VGV4dCxcclxuXHRTZWxlY3RcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL01hbmFnZXJcIlxyXG5cclxuY29uc3QgbWFuYWdlciA9IG5ldyBNYW5hZ2VyKCk7Il0sInNvdXJjZVJvb3QiOiIifQ==