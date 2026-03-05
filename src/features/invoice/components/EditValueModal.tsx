import {
	Button,
	Group,
	Modal,
	NumberInput,
	type NumberInputProps,
	Stack,
	TextInput,
	type TextInputProps,
} from "@mantine/core";
import { useEffect, useState } from "react";

interface EditValueModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: (value: string | number) => void;
	initialValue: string | number;
	title: string;
	label: string;
	inputType: "text" | "number";
	description?: string;
	textInputProps?: TextInputProps;
	numberInputProps?: NumberInputProps;
}

export function EditValueModal({
	opened,
	onClose,
	onConfirm,
	initialValue,
	title,
	label,
	inputType,
	description,
	textInputProps,
	numberInputProps,
}: EditValueModalProps) {
	const [value, setValue] = useState<string | number>(initialValue);

	// Update local state when initialValue changes or modal is opened
	useEffect(() => {
		if (opened) {
			setValue(initialValue);
		}
	}, [opened, initialValue]);

	const handleConfirm = () => {
		onConfirm(value);
		onClose();
	};

	return (
		<Modal opened={opened} onClose={onClose} title={title} centered size="sm">
			<Stack gap="md">
				{inputType === "text" ? (
					<TextInput
						label={label}
						description={description}
						value={value as string}
						onChange={(e) => setValue(e.currentTarget.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && value !== "") {
								handleConfirm();
							}
						}}
						data-autofocus
						{...textInputProps}
					/>
				) : (
					<NumberInput
						label={label}
						description={description}
						value={value as number}
						onChange={(v) => setValue(v || 0)}
						decimalScale={3}
						step={0.001}
						onKeyDown={(e) => {
							if (e.key === "Enter" && value !== "") {
								handleConfirm();
							}
						}}
						data-autofocus
						{...numberInputProps}
					/>
				)}
				<Group justify="flex-end">
					<Button variant="default" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleConfirm} disabled={value === ""}>
						Save
					</Button>
				</Group>
			</Stack>
		</Modal>
	);
}
