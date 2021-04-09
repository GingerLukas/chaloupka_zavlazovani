import { SharedVariable } from "./SharedVariable";

export class SharedRange {
    constructor(public prefix:string,public start:number,public end:number,public callback:Function, public onlyOnce:Boolean = false) {
        
    }

    handleSharedVar(variable: SharedVariable) {
        if (variable.name[0] == this.prefix && this.start <= variable.index && variable.index <= this.end) {
            variable.realTime = !this.onlyOnce;
            this.callback(variable, variable.index - this.start);
        }
    }
}