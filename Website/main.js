var manager;
var rules;

function toDateTime(secs) {
    let t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    console.log(t.getTimezoneOffset())
    return t;
}

function getState() {
    function listener() {
        console.log(this.responseText)
    }
    let req = new XMLHttpRequest();
    req.addEventListener("load", listener);
    req.open("GET", "http://192.168.1.133/shared.txt");
    req.send();
}

function save() {
    let out = [];
    for (const rule of rules) {
        out.push(rule.getUrlSetter());
    }
    let req = new XMLHttpRequest();
    req.open("GET", "http://192.168.1.133/sv?" + out.join('&'));
    req.send();
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function getTimeFromSeconds(seconds) {
    seconds %= 86400;
    return pad(Math.floor(seconds / 3600), 2) + ":" + pad(Math.floor((seconds % 3600) / 60), 2) + ":" + pad(Math.floor(seconds % 60), 2);
}

function getSecondsFromDate(date) {
    return date.getTime() / 1000;
}

function init() {
    class Sensor{
        main;
        misc;
        stat;
    }
    class RuleValue{
        start;
        end;
        type;
        target;
    }
    class Manager extends EventTarget{
        //#region CONSTANTS
        BUS_LEN = 4;
        BUS_ITEM_LEN = 2;
        BUS_SIZE = this.BUS_LEN * this.BUS_ITEM_LEN;

        RULE_NUM = 10;
        RULE_RANGE_LEN = 2;
        RULE_INFO_LEN = 4;

        RELAY_NUM = 6;

        RULE_RANGE_PREFIX = "S";
        RULE_RANGE_INDEX = 31;
        RULE_INFO_PREFIX = "U";
        RULE_INFO_INDEX = 21;

        SELECT_TO_INT = { "rule-none": 0, "rule-time": 1, "rule-temp": 2, "rule-humi": 3, "rule-cpwm": 4, "rule-ad": 5 };
        INT_TO_SELECT = { 0: "rule-none", 1: "rule-time", 2: "rule-temp", 3: "rule-humi", 4: "rule-cpwm", 5: "rule-ad" };
        //#endregion

        firstLoad = new CustomEvent("firstLoad");
        update = new CustomEvent("update");

        bus_a;
        bus_b;
        shared;
        current_rules;
        rules_cotrols;
        relay_states;

        constructor() {
            super();
            this.addEventListener("firstLoad", this.firstLoad);
        }

        firstLoad() {
            this.bus_a = Array.apply(null,Array(this.BUS_LEN)).map((x,i)=>new Sensor());
            this.bus_b = Array.apply(null, Array(this.BUS_LEN)).map((x, i) => new Sensor());
            this.current_rules = Array.apply(null, Array(this.RULE_NUM)).map((x, i) => new RuleValue());
            this.relay_states = Array.apply(null, Array(this.RELAY_NUM)).map((x, i) => false);

            

            this.interval = setInterval(this.updateState, 1000);
        }

        updateState(first = false) {
            function listener() {
                let values = this.responseText.split('|')
                for (let index = 0; index < values.length; index+=2) {
                    const variable = values[index];
                    let fn = manager[variable];
                    if (fn !== undefined) {
                        manager[variable](values[index + 1]);
                    }
                }
                if (first) {
                    manager.dispatchEvent(manager.firstLoad);
                }
                else {
                    manager.dispatchEvent(manager.update);
                }
            }
            var req = new XMLHttpRequest();
            req.addEventListener("load", listener);
            req.open("GET", "http://192.168.1.133/shared.txt");
            req.send();
        }

        readBus(index) {
            if (index<this.BUS_LEN) {
                return this.bus_a[index];
            }
            return this.bus_b[index - this.BUS_LEN];
        }


        //#region shared
        U00(value) { this.RULE_NUM = parseInt(value); }
        U01(value) { this.RULE_RANGE_LEN = parseInt(value); }
        U02(value) { this.RULE_INFO_LEN = parseInt(value); }
        U03(value) { this.RULE_RANGE_INDEX = parseInt(value); }
        U04(value) { this.RULE_INFO_INDEX = parseInt(value); }

        U10(value) { this.date = getTimeFromSeconds(parseInt(value)); }

        //#endregion
    }
    class Rule{
        start;
        end;
        type;
        target;
        bus;
        index;
        state;
        sensor;
        initClasses;
        constructor(ruleNode,index){
            this.start = ruleNode.getElementsByClassName('input-start')[1];
            this.end = ruleNode.getElementsByClassName('input-end')[1];
            this.type = ruleNode.getElementsByTagName('select')[0];
            this.type.value = this.type.options[0].value;
            this.initClasses = [...ruleNode.classList];
            this.target = ruleNode.getElementsByClassName('input-index')[1];
            this.bus = ruleNode.getElementsByClassName('input-bus')[1];
            this.state = ruleNode.getElementsByClassName('input-state')[1];
            this.sensor = ruleNode.getElementsByClassName('input-sensor')[1];
            this.index = index;
            this.node = ruleNode;

            manager.addEventListener("firstLoad", () => {
                this.type.value = manager.INT_TO_SELECT[manager.current_rules[this.index].type];
                let target = manager.current_rules[this.index].target;
                if (target < manager.BUS_LEN) {
                    this.target.value = target;
                    this.bus.value = "bus_a";
                }
                else {
                    target -= manager.BUS_LEN;
                    this.target.value = target;
                    this.bus.value = "bus_b";
                }
                
                this.start.value = manager.current_rules[this.index].start / this.getMult();
                this.end.value = manager.current_rules[this.index].end / this.getMult();
                this.updateStyle();
            });
            manager.addEventListener("update", () => {
                this.updateSensor();
            });

            this.type.addEventListener("change", () => {
                this.updateStyle();
            });

            this.bus.addEventListener("change", () => {
                this.updateSensor();
            });
            this.target.addEventListener("change", () => {
                this.updateSensor();
            });
        }
        updateStyle(){
            let classes = [...this.node.classList]
            for (const className of classes) {
                this.node.classList.remove(className);
            }
            this.initClasses.forEach((x,i)=>this.node.classList.add(x));
            this.node.classList.add(this.type.value);

            this.start.value = manager.current_rules[this.index].start / this.getMult();
            this.end.value = manager.current_rules[this.index].end / this.getMult();
            this.start.setAttribute("step", "0.5");
            this.end.setAttribute("step", "0.5");
            switch (this.type.value) {
                case "rule-none":
                    this.start.setAttribute("type", "number");
                    this.end.setAttribute("type", "number");

                    this.start.value = 0;
                    this.end.value = 0;

                    this.target.setAttribute("readonly","true");
                    this.bus.setAttribute("readonly","true");
                    this.start.setAttribute("readonly","true");
                    this.end.setAttribute("readonly","true");
                    break;
                case "rule-humi":
                    this.start.setAttribute("type","number");
                    this.end.setAttribute("type", "number");
                    
                    this.target.removeAttribute("readonly");
                    this.bus.removeAttribute("readonly");
                    this.start.removeAttribute("readonly");
                    this.end.removeAttribute("readonly");
                case "rule-temp":
                    this.start.setAttribute("type","number");
                    this.end.setAttribute("type", "number");

                    this.target.removeAttribute("readonly");
                    this.bus.removeAttribute("readonly");
                    this.start.removeAttribute("readonly");
                    this.end.removeAttribute("readonly");
                    break;
                case "rule-time":
                    this.start.setAttribute("type","time");
                    this.end.setAttribute("type", "time");
                    
                    this.start.value = getTimeFromSeconds(manager.current_rules[this.index].start) || "00:00";
                    this.end.value = getTimeFromSeconds(manager.current_rules[this.index].end) || "00:00";
                    this.start.setAttribute("step", "1");
                    this.end.setAttribute("step", "1");

                    this.target.setAttribute("readonly","true");
                    this.bus.setAttribute("readonly", "true");
                    
                    this.start.removeAttribute("readonly");
                    this.end.removeAttribute("readonly");
                    break;
                case "rule-cpwm":
                    this.start.setAttribute("type","number");
                    this.end.setAttribute("type", "number");
                    
                    this.target.setAttribute("readonly","false");
                    this.bus.setAttribute("readonly", "true");

                    this.start.removeAttribute("readonly");
                    this.end.removeAttribute("readonly");
                    break;
                default:
                    break;
            }
            this.updateSensor();
        }
        updateSensor() {
            let s;
            switch (this.type.value) {
                case "rule-none":
                    this.sensor.innerText = "--";
                    break;
                case "rule-temp":
                    s = manager[this.bus.value][this.target.valueAsNumber].main
                    this.sensor.innerText = Math.floor(s / this.getMult()) + "." + s % this.getMult() + " °C";
                    break;
                case "rule-humi":
                    s = manager[this.bus.value][this.target.valueAsNumber].misc
                    this.sensor.innerText = Math.floor(s / this.getMult()) + "." + (s % this.getMult()) + " %";
                    break;
                case "rule-time":
                    this.sensor.innerText = manager.date;
                    break;
                case "rule-cpwm":
                    this.sensor.innerText = manager.date;
                    break;
                default:
                    break;
            }
            this.state.innerText = (manager.relay_states[this.index] ? "ON" : "OFF");
        }
        getMult() {
            if (this.type.value == "rule-humi") {
                return (this.bus.value == "bus_a" ? 1 : 10);
            }
            if (this.type.value == "rule-temp") {
                return 100;
            }
            return 1;
        }

        getStart() {
            switch (this.type.value) {
                case "rule-node":
                    return 0;
                case "rule-time":
                    return getSecondsFromDate(this.start.valueAsDate);
                default:
                    return Math.floor(this.start.valueAsNumber * this.getMult());
            }
        }
        getEnd() {
            switch (this.type.value) {
                case "rule-node":
                    return 0;
                case "rule-time":
                    return getSecondsFromDate(this.end.valueAsDate);
                default:
                    return Math.floor(this.end.valueAsNumber * this.getMult());
            }
        }
        getType() {
            return manager.SELECT_TO_INT[this.type.value];
        }
        getTarget() {
            if (this.bus.value == "bus_a") {
                return this.target.valueAsNumber;
            }
            return this.target.valueAsNumber + manager.BUS_LEN;
        }
        getVar(offset) {
            
        }
        getUrlSetter() {
            return this.getVar(0) + "=" + this.getStart() + "&" + this.getVar(1) + "=" + this.getEnd() + "&" + this.getVar(2) + "=" + this.getType() + "&" + this.getVar(3) + "=" + this.getTarget();
        }
    }
    manager = new Manager();
    let rulesGrid = document.getElementById('rulesGrid');
    let ruleNode = rulesGrid.getElementsByTagName('div')[0];
    rules = [new Rule(ruleNode, 0)];
    ruleNode.classList
    for (let i = 1; i < 6; i++) {
        let node = ruleNode.cloneNode(true);
        rules.push(new Rule(node,i));
        rulesGrid.appendChild(node);
    }
    rules.forEach(x => x.updateStyle());
    
    manager.updateState(true);
}
