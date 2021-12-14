import type { Container, Resolvable } from '.';
interface BindingContract {
    resolvable: Resolvable<unknown>;
    shared: boolean;
}
declare class Binding implements BindingContract {
    resolvable: Resolvable<unknown>;
    shared: boolean;
    constructor(resolvable: Resolvable<unknown>, shared?: boolean);
    resolveInjectables(container: Container): unknown[];
    resolve(container: Container, params?: unknown[]): any;
    static isResolvable(binding: unknown): boolean;
    static once(resolvable: Resolvable<unknown>, container: Container, params: unknown[]): any;
}
export default Binding;
