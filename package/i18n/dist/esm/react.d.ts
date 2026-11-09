import { type ReactNode } from 'react';
import { buildTranslator, type I18n } from './core.js';
import type { KeysOf, MessageTree, NamespaceOf, TranslatorFor, Widen } from './internal/types.js';
import { type TransProps } from './trans.js';
export type MessageTranslator = ReturnType<typeof buildTranslator>;
export type I18nContextValue = {
    locale: string;
    dir: 'ltr' | 'rtl';
    messages: MessageTree;
    translator: (namespace?: string) => MessageTranslator;
};
export declare function I18nProvider(props: {
    locale: string;
    messages?: MessageTree;
    dictionary?: MessageTree;
    defaultMessages?: MessageTree;
    dir?: 'ltr' | 'rtl';
    children?: ReactNode;
}): import("react").FunctionComponentElement<import("react").ProviderProps<I18nContextValue | null>>;
export declare function useLocale<L extends string = string>(): L;
export declare function useTranslations<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L, NS extends NamespaceOf<M[D]> | undefined = undefined>(i18n: I18n<L, M, D>, namespace?: NS): TranslatorFor<M[D], NS>;
export declare function useTranslator<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(i18n: I18n<L, M, D>, namespace?: NamespaceOf<M[D]>): {
    t: TranslatorFor<M[D], undefined>;
};
export declare function useFormatter(options?: {
    timeZone?: string;
}): {
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
};
export declare function useI18n<L extends string = string>(): {
    locale: L;
    dir: 'ltr' | 'rtl';
    dictionary: MessageTree;
};
export declare function useDictionary<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(i18n: I18n<L, M, D>): Widen<M[D]>;
export declare function useDictionary(): MessageTree;
export declare function TransFromContext<K extends string = string>(props: Omit<TransProps<K>, 't'> & {
    namespace?: string;
}): ReactNode;
export declare function useTrans<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L>(i18n: I18n<L, M, D>, namespace?: NamespaceOf<M[D]>): (id: Parameters<TranslatorFor<M[D], undefined>>[0], options?: Omit<TransProps, 't' | 'id'>) => ReactNode;
export type { MessageTree, KeysOf, NamespaceOf, TranslatorFor, TransProps };
export type LocaleStoreLike = {
    getLocale(): string;
    subscribe(listener: () => void): () => void;
    setLocale(locale: string): void;
    t: unknown;
};
export declare function useLocaleStore<S extends LocaleStoreLike>(store: S): {
    locale: ReturnType<S['getLocale']>;
    t: S['t'];
    setLocale: (locale: string) => void;
};
