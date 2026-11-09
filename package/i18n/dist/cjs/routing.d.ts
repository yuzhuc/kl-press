import type { I18n, MessagesByLocale } from './core.js';
type Preference = {
    tag: string;
    quality: number;
};
export declare function parseAcceptLanguage(header: string | null | undefined): Preference[];
export type LocaleMatcher = (requested: readonly string[], available: readonly string[], defaultLocale: string) => string;
export type NegotiateOptions = {
    preference?: string | null;
    match?: LocaleMatcher;
};
export declare function negotiateLocale<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, header: string | null | undefined, options?: NegotiateOptions): L;
export type TrailingSlash = 'never' | 'always';
export type RedirectOptions = NegotiateOptions & {
    strategy?: 'always' | 'as-needed';
    trailingSlash?: TrailingSlash;
    landingPath?: string;
};
export declare function withTrailingSlash(path: string, trailingSlash?: TrailingSlash): string;
export declare function normalizeLocalePath<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, pathname: string): string | null;
export declare function planLocaleRedirect<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, pathname: string, acceptLanguage: string | null | undefined, options?: RedirectOptions): string | null;
export declare function stripLocale<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, pathname: string): {
    locale: L;
    path: string;
} | null;
export type SwitchLocaleOptions = {
    trailingSlash?: TrailingSlash;
    landingPath?: string;
};
export declare function switchLocalePath<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, pathname: string, locale: L, options?: SwitchLocaleOptions): string;
export declare const LOCALE_COOKIE = "NEXT_LOCALE";
export declare function readLocaleCookie(cookieHeader: string | null | undefined, name?: string): string | null;
export declare function writeLocaleCookie(locale: string, options?: {
    name?: string;
    maxAge?: number;
    path?: string;
    secure?: boolean;
}): void;
export {};
