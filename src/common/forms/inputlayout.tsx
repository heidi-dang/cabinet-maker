import React from "react";
import { cx } from "../utils";

export function InputLayout({ label, className, children }: any) {
	return (
		<div className={cx('ww-input-layout', className)}>
			<label>{label}</label>
			{children}
		</div>
	);
}