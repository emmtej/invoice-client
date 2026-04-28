import { notifications } from "@mantine/notifications";
import { AlertCircle, Check, Info } from "lucide-react";
import type { ReactNode } from "react";

interface NotifyBase {
	title?: string;
	message: ReactNode;
}

interface NotifyError extends NotifyBase {
	error?: unknown;
}

interface NotifyLoading extends NotifyBase {
	id: string;
}

interface NotifyUpdate extends NotifyBase {
	id: string;
	type: "success" | "error";
}

/**
 * Global notification utility wrapper for Mantine Notifications.
 * Enforces brand styling and consistent icons.
 */
export const notify = {
	success: ({ title, message }: NotifyBase) => {
		notifications.show({
			title,
			message,
			color: "wave",
			icon: <Check size={18} />,
			autoClose: 4000,
		});
	},

	error: ({ title, message, error }: NotifyError) => {
		let finalMessage = message;

		if (error instanceof Error) {
			finalMessage = (
				<>
					{message}
					<div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
						{error.message}
					</div>
				</>
			);
		}

		notifications.show({
			title: title || "Error",
			message: finalMessage,
			color: "red",
			icon: <AlertCircle size={18} />,
			autoClose: 6000,
		});
	},

	info: ({ title, message }: NotifyBase) => {
		notifications.show({
			title,
			message,
			color: "blue",
			icon: <Info size={18} />,
			autoClose: 4000,
		});
	},

	loading: ({ id, title, message }: NotifyLoading) => {
		notifications.show({
			id,
			title,
			message,
			color: "wave",
			loading: true,
			autoClose: false,
			withCloseButton: false,
		});
	},

	update: ({ id, type, title, message }: NotifyUpdate) => {
		const isSuccess = type === "success";
		notifications.update({
			id,
			title,
			message,
			color: isSuccess ? "wave" : "red",
			icon: isSuccess ? <Check size={18} /> : <AlertCircle size={18} />,
			loading: false,
			autoClose: isSuccess ? 4000 : 6000,
			withCloseButton: true,
		});
	},
};
