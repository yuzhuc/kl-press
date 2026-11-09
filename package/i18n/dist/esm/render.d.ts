import type { I18n } from './core.js';
import type { MessageTree, TranslatorFor } from './internal/types.js';
import { type TrailingSlash } from './routing.js';
export type RenderMode = 'ssg' | 'isr' | 'ssr' | 'csr' | 'ppr';
export type RenderOptions = {
    param?: string;
    paths?: readonly string[];
    landingPath?: string;
    trailingSlash?: TrailingSlash;
};
export type RenderPlan<L extends string, Mode extends RenderMode = RenderMode> = {
    mode: Mode;
    params: Array<Record<string, string>>;
    routes: string[];
    dynamicParams: Mode extends 'isr' ? true : false;
    resolveLocale: (raw: string | null | undefined) => L | null;
};
export declare function localeParams<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L>(i18n: I18n<L, M, D>, options?: {
    param?: string;
}): Array<Record<string, string>>;
export declare function localeRoutes<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L>(i18n: I18n<L, M, D>, paths: readonly string[], options?: RenderOptions): string[];
export declare function staticLocale<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L>(i18n: I18n<L, M, D>, raw: string | null | undefined): L | null;
export declare function createRenderPlan<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L, Mode extends RenderMode = RenderMode>(i18n: I18n<L, M, D>, mode: Mode, options?: RenderOptions): RenderPlan<L, Mode>;
export type SsgPlan<L extends string> = RenderPlan<L, 'ssg'>;
export declare function createSsgPlan<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L>(i18n: I18n<L, M, D>, options?: RenderOptions): SsgPlan<L>;
export type IsrPlan<L extends string> = RenderPlan<L, 'isr'>;
export declare function createIsrPlan<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L>(i18n: I18n<L, M, D>, options?: RenderOptions): IsrPlan<L>;
export declare function isrLocale<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L>(i18n: I18n<L, M, D>, raw: string | null | undefined): L | null;
export type PprPlan<L extends string> = RenderPlan<L, 'ppr'>;
export declare function createPprPlan<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L>(i18n: I18n<L, M, D>, options?: RenderOptions): PprPlan<L>;
export type LocaleStoreOptions = {
    locale?: string;
    cookie?: string;
    persist?: boolean;
};
export declare function createLocaleStore<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(i18n: I18n<L, M, D>, options?: LocaleStoreOptions): {
    getLocale: () => L;
    setLocale: (locale: string) => void;
    subscribe(listener: () => void): () => void;
    t: TranslatorFor<M[D], undefined>;
};
export type LocaleStore<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L> = ReturnType<typeof createLocaleStore<L, M, D>>;
