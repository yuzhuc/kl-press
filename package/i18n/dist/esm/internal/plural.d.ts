declare function rulesFor(locale: string, ordinal?: boolean): Intl.PluralRules;
export { rulesFor };
export declare function pluralCategory(locale: string, count: number, ordinal?: boolean): string;
export declare function selectPluralForm(text: string, count: number, locale: string): string;
