export type RichNode = {
    kind: 'text';
    value: string;
} | {
    kind: 'tag';
    name: string;
    selfClosing: boolean;
    children: RichNode[];
};
export declare function parseRich(message: string): RichNode[];
