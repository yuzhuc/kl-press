import type { I18n } from './core.js';
import type { KeysOf, MessageTree, NamespaceOf, TFunction, TranslateOptions, TranslatorFor, Values } from './internal/types.js';
export type RequestScope<L extends string> = {
    locale: L;
    messages: MessageTree;
};
export declare function createI18nRuntime<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(i18n: I18n<L, M, D>): {
    i18n: I18n<L, M, D>;
    run: <A>(locale: string, fn: () => A) => A;
    getScope: () => RequestScope<L>;
    getLocale: () => L;
    getTranslations: <NS extends NamespaceOf<M[D]> | undefined = undefined>(namespace?: NS) => TranslatorFor<M[D], NS>;
    t: (key: Parameters<TFunction<KeysOf<M[D]>>>[0], values?: Values, options?: TranslateOptions) => string;
};
export type I18nRuntime<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L> = ReturnType<typeof createI18nRuntime<L, M, D>>;
export { assertLocaleParam, resolveLocaleParam } from './internal/params.js';
