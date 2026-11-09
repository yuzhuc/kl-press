export declare function normalizeLocaleTag(value: string): string;
export declare const rtlLocales: readonly [
    "ar",
    "arc",
    "ckb",
    "dv",
    "fa",
    "he",
    "ku",
    "ps",
    "sd",
    "ug",
    "ur",
    "yi"
];
export type RTLLocale = (typeof rtlLocales)[number];
export declare function isRTL(locale: string): boolean;
export declare function getLocaleDirection(locale: string): 'ltr' | 'rtl';
export declare function makeLocaleResolver<L extends string>(locales: readonly L[], defaultLocale: L): (value?: string | null) => L;
