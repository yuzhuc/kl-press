export type MessageTree = {
    readonly [key: string]: string | MessageTree;
};
export type Values = Record<string, string | number | Date>;
export type KeysOf<T> = {
    [K in keyof T & string]: T[K] extends string ? K : `${K}.${KeysOf<T[K]>}`;
}[keyof T & string];
export type NamespaceOf<T> = {
    [K in keyof T & string]: T[K] extends string ? never : K;
}[keyof T & string];
export type KeysUnder<T extends MessageTree, NS extends keyof T & string> = T[NS] extends string ? never : T[NS] extends MessageTree ? KeysOf<T[NS]> : string;
export type PathValue<D, P extends string> = P extends `${infer Head}.${infer Rest}` ? Head extends keyof D ? PathValue<D[Head], Rest> : never : P extends keyof D ? D[P] : never;
type Trim<S extends string> = S extends ` ${infer R}` ? Trim<R> : S extends `${infer R} ` ? Trim<R> : S;
type PlaceholderName<S extends string> = S extends '' | `#${string}` | `${string} ${string}` | `${string}{${string}` ? never : S;
export type MessageParams<S extends string> = S extends `${string}{${infer Name},${infer Rest}` ? PlaceholderName<Trim<Name>> | MessageParams<Rest> : S extends `${string}{${infer Name}}${infer Rest}` ? [
    PlaceholderName<Trim<Name>>
] extends [
    never
] ? MessageParams<`${Name}}${Rest}`> : PlaceholderName<Trim<Name>> | MessageParams<Rest> : never;
export type ValuesFor<S> = [
    MessageParams<S & string>
] extends [
    never
] ? Values : 'count' extends MessageParams<S & string> ? {
    [K in Exclude<MessageParams<S & string>, 'count'>]: string | number | Date;
} & {
    count?: number;
} : {
    [K in MessageParams<S & string>]: string | number | Date;
};
export type TranslateOptions = {
    count?: number;
    locale?: string;
    timeZone?: string;
};
type MessageAt<D, Key extends string> = D extends MessageTree ? PathValue<D, Key> : never;
export type ValuesArgs<V> = [
    MessageParams<V & string>
] extends [
    never
] ? [
    values?: Values,
    options?: TranslateOptions
] : Exclude<MessageParams<V & string>, 'count'> extends never ? [
    values?: ValuesFor<V>,
    options?: TranslateOptions
] : [
    values: ValuesFor<V>,
    options?: TranslateOptions
];
export type TFunction<K extends string = string, D = unknown> = <Key extends K>(key: Key, ...args: ValuesArgs<MessageAt<D, Key>>) => string;
export type TranslatorFor<D, NS extends string | undefined> = NS extends string ? TFunction<KeysUnder<D & MessageTree, NS & keyof D>, D> : TFunction<KeysOf<D>, D>;
export type Widen<T> = T extends string ? string : {
    [K in keyof T]: Widen<T[K]>;
};
export type LocaleLabel = {
    native: string;
    english: string;
};
export type MessageReport = {
    missing: string[];
    surplus: string[];
};
export type PlaceholderMismatch = {
    key: string;
    missing: string[];
    surplus: string[];
};
export type MessagesByLocale<L extends string> = Record<L, MessageTree>;
export type I18nConfig<M extends {
    readonly [K in string]: MessageTree;
}, D extends keyof M & string> = {
    locales: readonly (keyof M & string)[];
    defaultLocale: D;
    messages: M;
    displayNames?: Partial<Record<keyof M & string, LocaleLabel>>;
};
type SameKeySet<A, B> = [
    KeysOf<A>
] extends [
    KeysOf<B>
] ? [
    KeysOf<B>
] extends [
    KeysOf<A>
] ? true : false : false;
export type DictionaryParity<M extends {
    readonly [K in string]: MessageTree;
}, D extends keyof M & string> = false extends {
    [K in keyof M]: SameKeySet<M[K], M[D]>;
}[keyof M] ? {
    readonly __dictionaryMismatch: `Every locale needs the same keys as "${D}"`;
} : unknown;
export type I18n<L extends string, M extends {
    readonly [K in L]: MessageTree;
}, D extends L = L> = {
    locales: readonly L[];
    defaultLocale: L;
    defaultMessages: M[D];
    messages: M;
    hasLocale: (value: string) => value is L;
    resolveLocale: (value?: string | null) => L;
    getMessages: (locale: string) => Widen<M[D]>;
    hasKey: (locale: string, key: string) => boolean;
    missingKeys: (locale: string) => string[];
    surplusKeys: (locale: string) => string[];
    messageReport: (locale: string) => MessageReport;
    placeholderReport: (locale: string) => PlaceholderMismatch[];
    checkMessages: () => void;
    getLocaleLabel: (locale: string) => LocaleLabel;
    getLocaleName: (locale: string) => string;
    createTranslator: <NS extends string | undefined = undefined>(locale: L, namespace?: NS) => TranslatorFor<M[D], NS>;
};
export type MessagesAt<M, L extends string> = M[L & keyof M];
export type LocaleParams = Promise<Record<string, string | string[]>> | Record<string, string | string[]>;
export type Dictionary<T extends MessageTree = MessageTree> = T;
export type DictionaryKeys<T extends MessageTree = MessageTree> = keyof T;
export type TranslationKey<T extends MessageTree = MessageTree> = KeysOf<T>;
export type NestedKeyOf<T = MessageTree> = KeysOf<T>;
export type TranslationVars = Values;
export {};
