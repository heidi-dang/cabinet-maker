export function cx(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export function isFunction(value: any): value is Function {
    return typeof value === 'function';
}