import type { TranslateOptions, Values } from './types.js';
type Resolver = (name: string) => string | number | Date | undefined;
type RenderOptions = {
    pound?: number;
    timeZone?: string;
};
export declare function stripQuoted(template: string): string;
export declare function renderIcu(template: string, resolve: Resolver, locale: string, options?: RenderOptions): string;
export declare function looksLikeIcu(template: string): boolean;
export declare function renderMessage(template: string, values: Values | undefined, options: TranslateOptions | undefined, locale: string): string;
export {};
