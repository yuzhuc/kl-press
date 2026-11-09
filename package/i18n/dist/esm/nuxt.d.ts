import type { App } from 'vue';
import type { I18n } from './core.js';
import type { MessageTree } from './internal/types.js';
export type HeadersLike = {
    get(name: string): string | null;
} | Record<string, string | string[] | undefined>;
export declare function headerValue(headers: HeadersLike, name: string): string | null;
export type RequestLike = {
    headers: HeadersLike;
};
export type NuxtLocaleOptions = {
    cookie?: string;
};
export declare function localeFromRequest<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L>(i18n: I18n<L, M, D>, request: RequestLike, options?: NuxtLocaleOptions): L;
export type H3EventLike = {
    headers?: HeadersLike;
    node?: {
        req?: {
            headers?: HeadersLike;
        };
    };
    web?: {
        request?: {
            headers?: HeadersLike;
        };
    };
};
export declare function eventHeaders(event: H3EventLike): HeadersLike | undefined;
export type NuxtAppLike = {
    vueApp: App;
    ssrContext?: {
        event?: H3EventLike;
    } | null;
};
export declare function createNuxtI18nPlugin<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(i18n: I18n<L, M, D>, options?: NuxtLocaleOptions & {
    locale?: string;
}): (nuxtApp: NuxtAppLike) => void;
export type NodeResponseLike = {
    statusCode?: number;
    setHeader(name: string, value: string): void;
    end(): void;
};
export type LocaleMiddlewareEvent = {
    headers?: HeadersLike;
    node?: {
        req?: {
            url?: string;
            headers?: HeadersLike;
        };
        res?: NodeResponseLike;
    };
    web?: {
        request?: {
            url?: string;
            headers?: HeadersLike;
        };
    };
    handled?: boolean;
};
export type LocaleServerMiddlewareOptions = {
    landingPath?: string;
    cookie?: string;
    trailingSlash?: 'never' | 'always';
    ignore?: RegExp;
    status?: number;
};
export declare function createLocaleServerMiddleware<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L>(i18n: I18n<L, M, D>, options?: LocaleServerMiddlewareOptions): (event: LocaleMiddlewareEvent) => void;
