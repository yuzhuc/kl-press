import type { MessageTree, Values } from './types.js';
export declare const hasOwn: (target: object, key: string) => boolean;
export type KeyPath = string | readonly string[];
export declare function resolveNode(messages: MessageTree, key: KeyPath): string | MessageTree | undefined;
export declare const getNestedValue: typeof resolveNode;
export declare function resolveMessage(messages: MessageTree, key: KeyPath): string | undefined;
export declare function formatMessage(template: string, values?: Values): string;
export declare const interpolate: typeof formatMessage;
export declare function missingKeysIn(reference: MessageTree, target: MessageTree): string[];
export declare const deepCompareKeys: typeof missingKeysIn;
export declare function flattenKeys(messages: MessageTree, prefix?: string): string[];
export declare function placeholdersIn(message: string): string[];
export declare function placeholderMismatches(reference: MessageTree, target: MessageTree): Array<{
    key: string;
    missing: string[];
    surplus: string[];
}>;
