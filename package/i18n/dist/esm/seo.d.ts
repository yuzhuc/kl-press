import type { I18n, MessagesByLocale } from './core.js';
export type Alternates = {
    canonical: string;
    languages: Record<string, string>;
};
export declare function getBaseUrl(domain?: string | null): string;
export type TrailingSlash = 'never' | 'always';
export type HreflangMap<L extends string> = Partial<Record<L, string>>;
export declare function normalizePath(path: string, trailingSlash?: TrailingSlash): string;
export declare function generateAlternates<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, path: string, options?: {
    baseUrl?: string;
    locale?: string;
    trailingSlash?: TrailingSlash;
    hreflangMap?: HreflangMap<L>;
}): Alternates;
export type SitemapEntry = {
    url: string;
    lastModified?: Date | string;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    alternates?: {
        languages: Record<string, string>;
    };
};
export type SitemapRoute = {
    path: string;
    lastModified?: Date | string;
    changeFrequency?: SitemapEntry['changeFrequency'];
    priority?: number;
};
export declare function generateSitemap<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, routes: readonly SitemapRoute[], options?: {
    baseUrl?: string;
    trailingSlash?: TrailingSlash;
    hreflangMap?: HreflangMap<L>;
}): SitemapEntry[];
export type OgLocaleMap<L extends string> = Partial<Record<L, string>>;
export declare function getOgLocale<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, locale: string, map?: OgLocaleMap<L>): string;
export declare function getOgLocaleAlternates<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, locale: string, map?: OgLocaleMap<L>): string[];
export type RobotsRules = {
    userAgent: string;
    allow?: string | string[];
    disallow?: string | string[];
    crawlDelay?: number;
};
export type Robots = {
    rules: RobotsRules | RobotsRules[];
    sitemap?: string;
    host?: string;
};
export declare function generateRobots(options?: {
    baseUrl?: string;
    rules?: RobotsRules | RobotsRules[];
    host?: string;
}): Robots;
export type PageMetadataInput<L extends string> = {
    title?: string;
    description?: string;
    path: string;
    locale: L | string;
    baseUrl?: string;
    siteName?: string;
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
};
export declare function buildPageMetadata<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, input: PageMetadataInput<L>): {
    title?: string;
    description?: string;
    alternates: Alternates;
    openGraph: Record<string, unknown>;
    twitter: Record<string, unknown>;
};
export declare function createSeo<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>): {
    generateAlternates: (path: string, baseUrl?: string, options?: {
        locale?: string;
        trailingSlash?: TrailingSlash;
        hreflangMap?: HreflangMap<L>;
    }) => Alternates;
    generateSitemap: (routes: readonly SitemapRoute[], baseUrl?: string, trailingSlash?: TrailingSlash, hreflangMap?: HreflangMap<L>) => SitemapEntry[];
    getOgLocale: (locale: string, map?: OgLocaleMap<L>) => string;
    getOgLocaleAlternates: (locale: string, map?: OgLocaleMap<L>) => string[];
    buildPageMetadata: (input: Omit<PageMetadataInput<L>, "locale"> & {
        locale: string;
    }) => {
        title?: string;
        description?: string;
        alternates: Alternates;
        openGraph: Record<string, unknown>;
        twitter: Record<string, unknown>;
    };
};
export declare function getMetadataBase(baseUrl?: string | null): URL | undefined;
export type WebsiteJsonLd = {
    '@context': 'https://schema.org';
    '@type': 'WebSite';
    name: string;
    url?: string;
    inLanguage: string[];
    alternateName?: string;
};
export declare function generateWebsiteJsonLd<L extends string, M extends MessagesByLocale<L>, D extends L = L>(i18n: I18n<L, M, D>, options: {
    name: string;
    baseUrl?: string;
    alternateName?: string;
}): WebsiteJsonLd;
export declare function serializeJsonLd(data: unknown): string;
