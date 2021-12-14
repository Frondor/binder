import type { Key, Resolvable } from '.';
export default class Container {
    protected bindings: Map<any, any>;
    protected instances: Map<any, any>;
    protected aliases: Map<any, any>;
    /**
     * Checks if anything has been bound or aliased into the Container
     */
    has(key: Key): boolean;
    /**
     * Binds a resolvable function into the Container
     *
     * If it is the only param, the object reference works as the reference key
     */
    bind(key: Key | Resolvable<unknown>, resolvable?: unknown | Resolvable<unknown>, shared?: boolean): this;
    private resolve;
    /**
     * Resolves a Binding reference from the Container
     *
     * If the given key is a Resolvable function,
     * it is resolved from the Container on the fly
     */
    make(key: unknown, ...params: unknown[]): any;
    /**
     * Resolves a Binding reference from the Container
     */
    get<T extends new (...p: any[]) => InstanceType<T>>(key: T): InstanceType<T>;
    get<T>(key: T): T extends new () => infer I ? I : unknown;
    /**
     * Set an object or primitive value into the Container
     *
     * When resolved, it returns the same value and reference
     */
    instance(key: Key, value: unknown): void;
    /**
     * Bind a Resolvable function into the Container.
     *
     * The function is resolved once. Its result is stored
     * and returned on subsequent calls to `get` or `make`.
     */
    singleton(key: Key, resolvable: unknown): this;
    private getInstance;
    /**
     * Apply an alias to an already-bound binding
     */
    alias(alias: unknown, key: Key | Resolvable<unknown>): void;
    private getAlias;
}
