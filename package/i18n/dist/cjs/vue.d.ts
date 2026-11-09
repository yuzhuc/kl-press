import { type Component, type ComputedRef, type Plugin, type PropType, type Ref, type VNode } from 'vue';
import type { I18n } from './core.js';
import type { MessageTree, NamespaceOf, TranslateOptions, TranslatorFor, Values, Widen } from './internal/types.js';
export type VueI18nContext<L extends string = string, D = MessageTree> = {
    locale: Ref<L>;
    dir: ComputedRef<'ltr' | 'rtl'>;
    dictionary: ComputedRef<Widen<D>>;
    t: TranslatorFor<D, undefined>;
    setLocale: (locale: string) => void;
};
type LooseTranslator = (key: string, values?: Values, options?: TranslateOptions) => string;
export type RouteLocationLike = {
    path: string;
    params?: Record<string, string | string[] | undefined>;
};
export type RouteRedirect = {
    path: string;
};
export type RouterLike = {
    beforeEach(guard: (to: RouteLocationLike) => RouteRedirect | void): unknown;
};
export type VueI18nPluginOptions = {
    locale?: string;
    router?: RouterLike;
    param?: string;
    landingPath?: string;
    trailingSlash?: 'never' | 'always';
};
export declare function createI18nPlugin<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(i18n: I18n<L, M, D>, options?: VueI18nPluginOptions): Plugin;
export declare function useI18n<L extends string = string, D = MessageTree>(): VueI18nContext<L, D>;
export declare function useLocale<L extends string = string>(): Ref<L>;
export declare function useSetLocale(): (locale: string) => void;
export declare function useTranslations<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L, NS extends NamespaceOf<M[D]> | undefined = undefined>(i18n: I18n<L, M, D>, namespace?: NS): TranslatorFor<M[D], NS>;
export declare function useFormatter(options?: {
    timeZone?: string;
}): ComputedRef<{
    date: (value: Date | string | number, format?: import("./format.js").DateFormat) => string;
    time: (value: Date | string | number, format?: import("./format.js").TimeFormat) => string;
    dateTime: (value: Date | string | number, format?: import("./format.js").TimeFormat) => string;
    relativeDate: (value: Date | string | number, now?: Date | number) => string;
    list: (items: readonly string[], type?: import("./format.js").ListType) => string;
    localeName: (code: string, type?: import("./format.js").LocaleNameType) => string;
    duration: (duration: import("./format.js").Duration) => string;
    number: (value: number, format?: import("./format.js").NumberFormat, numberOptions?: Intl.NumberFormatOptions) => string;
    currency: (value: number, currency?: string) => string;
    compact: (value: number) => string;
}>;
export type VueTransComponent = string | Component;
export type VueTransComponents = Record<string, VueTransComponent>;
export declare const Trans: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    t: {
        type: PropType<LooseTranslator>;
        default: undefined;
    };
    id: {
        type: StringConstructor;
        default: undefined;
    };
    text: {
        type: StringConstructor;
        default: undefined;
    };
    values: {
        type: PropType<Values>;
        default: undefined;
    };
    options: {
        type: PropType<TranslateOptions>;
        default: undefined;
    };
    components: {
        type: PropType<VueTransComponents>;
        default: undefined;
    };
}>, () => string | VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    t: {
        type: PropType<LooseTranslator>;
        default: undefined;
    };
    id: {
        type: StringConstructor;
        default: undefined;
    };
    text: {
        type: StringConstructor;
        default: undefined;
    };
    values: {
        type: PropType<Values>;
        default: undefined;
    };
    options: {
        type: PropType<TranslateOptions>;
        default: undefined;
    };
    components: {
        type: PropType<VueTransComponents>;
        default: undefined;
    };
}>> & Readonly<{}>, {
    text: string;
    values: Values;
    t: LooseTranslator;
    components: VueTransComponents;
    id: string;
    options: TranslateOptions;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export {};
