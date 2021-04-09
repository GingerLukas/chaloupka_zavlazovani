export function pad(num: string | number, size: number) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

export function addRelativeCallback<T>(target: EventTarget, event: string, obj: T, callback: (obj: T) => void) {
    (function (s: T, m: EventTarget, call: Function) {
        m.addEventListener(event, () => callback(s), false);
    })(obj, target, callback);
}

export function createDragTarget(element: Element) {
    element.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
}

export function uuidv4(): string {
    //@ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export function secondsToDate(seconds: number) {
    let h = Math.floor(seconds / 3600);
    seconds %= 3600;
    let m = Math.floor(seconds / 60);
    seconds %= 60;
    return pad(h, 2) + ":" + pad(m, 2) + ":" + pad(seconds, 2);
}

export function dateToSeconds(date: string) {
    let arr = date.split(":");

    let sum = 0;
    if (arr[0]) {
        sum += parseInt(arr[0]) * 3600
    }
    if (arr[1]) {
        sum += parseInt(arr[1]) * 60
    }
    if (arr[2]) {
        sum += parseInt(arr[2])
    }

    return sum;
}

export function enableDrop(target: Element) {
    target.addEventListener("dragover", x => {
        x.preventDefault();
        x.stopPropagation();
    })
}