import { type ReactNode } from 'react';
import type { TFunction, TranslateOptions, Values } from './internal/types.js';
export type TransComponent = ReactNode | ((children: ReactNode) => ReactNode);
export type TransComponents = Record<string, TransComponent>;
export type TransProps<K extends string = string, D = unknown> = {
    t?: TFunction<K, D>;
    id?: NoInfer<K>;
    text?: string;
    values?: Values;
    options?: TranslateOptions;
    components?: TransComponents;
};
export declare function Trans<K extends string, D = unknown>(props: TransProps<K, D>): ReactNode;
export declare function createTrans(components: TransComponents): <K extends string>(source: {
    t: TFunction<K>;
    id: NoInfer<K>;
    values?: Values;
    options?: TranslateOptions;
} | string, values?: Values) => ReactNode;
export type { TFunction, Values } from './internal/types.js';
