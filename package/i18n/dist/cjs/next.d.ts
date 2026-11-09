import type { I18n } from './core.js';
import type { MessageTree } from './internal/types.js';
import type { TranslatorFor, Widen } from './internal/types.js';
import { buildPageMetadata, type HreflangMap, type OgLocaleMap, type PageMetadataInput, type TrailingSlash } from './seo.js';
export type NextParams = Promise<Record<string, string | string[]>> | Record<string, string | string[]>;
export type ParamOptions = {
    param?: string;
};
type AnyDict = {
    readonly [K in string]: MessageTree;
};
export declare function i18nStaticParams<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(i18n: I18n<L, M, D>, options?: ParamOptions): () => Array<Record<string, L>>;
export declare function getI18n<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(params: NextParams, i18n: I18n<L, M, D>, options?: ParamOptions): Promise<{
    locale: L;
    t: TranslatorFor<M[D], undefined>;
    dictionary: Widen<M[D]>;
    dict: Widen<M[D]>;
}>;
export declare function getI18nLocale<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(params: NextParams, i18n: I18n<L, M, D>, options?: ParamOptions): Promise<L>;
export declare function getI18nLocaleOrNull<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(params: NextParams, i18n: I18n<L, M, D>, options?: ParamOptions): Promise<L | null>;
export type { AnyDict };
export type LocaleMetadataOptions<L extends string, Dict> = ParamOptions & {
    path: string;
    strict?: boolean;
    baseUrl?: string;
    siteName?: string;
    image?: PageMetadataInput<L>['image'];
    ogLocaleMap?: OgLocaleMap<L>;
    hreflangMap?: HreflangMap<L>;
    trailingSlash?: TrailingSlash;
    build?: (context: {
        locale: L;
        t: TranslatorFor<Dict, undefined>;
        dictionary: Widen<Dict>;
    }) => {
        title?: string;
        description?: string;
    };
};
export declare function localeMetadata<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(i18n: I18n<L, M, D>, params: NextParams, options: LocaleMetadataOptions<L, M[D]>): Promise<Partial<ReturnType<typeof buildPageMetadata>>>;
export type LocaleMiddlewareOptions = {
    landingPath?: string;
    cookie?: string;
    trailingSlash?: 'never' | 'always';
    ignore?: RegExp;
    status?: number;
};
export declare function createLocaleMiddleware<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L>(i18n: I18n<L, M, D>, options?: LocaleMiddlewareOptions): (request: Request) => Response | undefined;
