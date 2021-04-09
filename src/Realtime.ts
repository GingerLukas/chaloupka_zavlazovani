import { addRelativeCallback, uuidv4 } from "./Helper";
import { Manager } from "./Manager";

export class Realtime {
    id: string;
    constructor(target: EventTarget) {
        addRelativeCallback(target, "update", this, (x) => x.updateHandler());
        this.id = uuidv4();
    }
    updateHandler() {
        
    }
}