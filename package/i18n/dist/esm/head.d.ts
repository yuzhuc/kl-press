import type { I18n, MessagesByLocale } from './core.js';
import { type HreflangMap, type OgLocaleMap, type TrailingSlash } from './seo.js';
export type HeadMeta = {
    name?: string;
    property?: string;
    content: string;
};
export type HeadLink = {
    rel: string;
    href: string;
    hreflang?: string;
};
export type HeadScript = {
    type: string;
    innerHTML: string;
};
export type LocaleHeadInput<L extends string> = {
    locale: L | string;
    path: string;
    baseUrl?: string;
    siteName?: string;
    title?: string;
    description?: string;
    image?: {
        url: string;
        width?: number;
        height?: number;
        alt?: string;
    };
    type?: 'website' | 'article';
    ogLocaleMap?: OgLocaleMap<L>;
    hreflangMap?: HreflangMap<L>;
    trailingSlash?: TrailingSlash;
    noIndex?: boolean;
    website?: {
        alternateName?: string;
    };
    jsonLd?: unknown[];
};
export type LocaleHeadOutput = {
    htmlAttrs: {
        lang: string;
        dir: 'ltr' | 'rtl';
    };
    title?: string;
    meta: HeadMeta[];
    link: HeadLink[];
    script: HeadScript[];
};
export declare function localeHead<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, input: LocaleHeadInput<L>): LocaleHeadOutput;
