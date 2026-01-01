import React from "react";

export function Button({ children, type = 'button', ...props }: any) {
	return (
		<button type={type} {...props}>{children}</button>
	);
}