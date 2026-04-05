import { Modal, type ModalProps, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface AppModalProps extends Omit<ModalProps, "title"> {
	title: string | ReactNode;
}

export function AppModal({ title, children, ...rest }: AppModalProps) {
	const titleContent =
		typeof title === "string" ? (
			<Text
				fw={800}
				size="xl"
				c="gray.8"
				className="tracking-tight text-balance"
			>
				{title}
			</Text>
		) : (
			title
		);

	return (
		<Modal title={titleContent} {...rest}>
			{children}
		</Modal>
	);
}
