import React from "react";
import { cx } from "./utils";

export function Form({ children, className, ...props }: any) {
    return (
        <form className={cx('ww-form', className)} {...props}>
            {children}
        </form>
    );
}