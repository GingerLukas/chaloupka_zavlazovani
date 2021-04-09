export interface IDragAndDrop {
    handleDrop(obj: IDragAndDrop, target: Element): void;
    getType(): string;
    id: string;
}