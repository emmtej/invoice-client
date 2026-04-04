import { Modal, type ModalProps, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface AppModalProps extends Omit<ModalProps, "title"> {
	title: string | ReactNode;
}

export function AppModal({ title, children, ...rest }: AppModalProps) {
	const titleContent =
		typeof title === "string" ? (
			<Text fw={800} lts={-0.5}>
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
