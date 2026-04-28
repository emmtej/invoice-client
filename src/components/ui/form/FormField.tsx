import { Input, type InputWrapperProps } from "@mantine/core";
import type { ReactNode } from "react";

interface FormFieldProps extends Omit<InputWrapperProps, "error"> {
	label: string;
	error?: string;
	required?: boolean;
	children: ReactNode;
}

export function FormField({
	label,
	error,
	required,
	children,
	...rest
}: FormFieldProps) {
	return (
		<Input.Wrapper label={label} error={error} required={required} {...rest}>
			{children}
		</Input.Wrapper>
	);
}
