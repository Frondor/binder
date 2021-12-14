export { default as Container } from './Container';
export declare type Key = unknown;
export declare type Injectable = {
    injects: Array<Resolvable<unknown>>;
};
export declare type Resolvable<T> = {
    (...params: unknown[]): T;
} & {
    new (...params: unknown[]): T;
} & T & Injectable;
