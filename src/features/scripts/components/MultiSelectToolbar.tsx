import { Button, Group, Paper, Text, Transition } from "@mantine/core";
import { Copy, FolderInput, Trash2, X } from "lucide-react";

interface MultiSelectToolbarProps {
	selectedCount: number;
	onClear: () => void;
	onDelete: () => void;
	onMove: () => void;
	onCopy: () => void;
}

export function MultiSelectToolbar({
	selectedCount,
	onClear,
	onDelete,
	onMove,
	onCopy,
}: MultiSelectToolbarProps) {
	return (
		<Transition
			mounted={selectedCount > 0}
			transition="slide-up"
			duration={200}
			timingFunction="ease"
		>
			{(styles) => (
				<Paper
					shadow="md"
					p="xs"
					bg="gray.8"
					radius="md"
					style={{
						...styles,
						position: "fixed",
						bottom: 24,
						left: "50%",
						transform: "translateX(-50%)",
						zIndex: 1000,
						color: "white",
						display: "flex",
						alignItems: "center",
						gap: "1rem",
					}}
				>
					<Group gap="sm" px="sm">
						<Text size="sm" fw={600}>
							{selectedCount} {selectedCount === 1 ? "item" : "items"} selected
						</Text>
						<Button
							variant="subtle"
							color="gray.4"
							size="compact-xs"
							onClick={onClear}
							leftSection={<X size={14} />}
						>
							Clear
						</Button>
					</Group>

					<Group gap="xs">
						<Button
							variant="subtle"
							color="gray.0"
							size="sm"
							onClick={onCopy}
							leftSection={<Copy size={16} />}
						>
							Copy
						</Button>
						<Button
							variant="subtle"
							color="gray.0"
							size="sm"
							onClick={onMove}
							leftSection={<FolderInput size={16} />}
						>
							Move
						</Button>
						<Button
							variant="subtle"
							color="red.4"
							size="sm"
							onClick={onDelete}
							leftSection={<Trash2 size={16} />}
						>
							Delete
						</Button>
					</Group>
				</Paper>
			)}
		</Transition>
	);
}
