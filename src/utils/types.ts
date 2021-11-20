export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type CommandDataType<T> = T extends (...args: any) => any ? Awaited<ReturnType<T>> : unknown;
