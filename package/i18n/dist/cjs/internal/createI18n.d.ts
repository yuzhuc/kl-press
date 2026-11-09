import type { DictionaryParity, I18nConfig, I18n, LocaleParams, MessageTree } from './types.js';
export declare function defineI18n<const M extends {
    readonly [K in string]: MessageTree;
}, const D extends keyof M & string = keyof M & string>(config: I18nConfig<M, D> & DictionaryParity<M, D>): I18n<keyof M & string, M, D>;
export type { LocaleParams };
