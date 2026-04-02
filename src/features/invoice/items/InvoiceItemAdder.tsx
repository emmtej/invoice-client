import { Button, Divider, Group, Paper, Text, TextInput } from "@mantine/core";
import { IconList, IconPlus } from "@tabler/icons-react";

interface InvoiceItemAdderProps {
	newItemName: string;
	setNewItemName: (value: string) => void;
	handleAddItem: () => void;
}

export function InvoiceItemAdder({
	newItemName,
	setNewItemName,
	handleAddItem,
}: InvoiceItemAdderProps) {
	return (
		<Paper
			withBorder
			p="lg"
			radius="md"
			mt="xl"
			bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))"
		>
			<Divider
				mb="sm"
				label={
					<Group gap="xs">
						<IconList size={20} />
						<Text fw={700} size="lg">
							Items
						</Text>
					</Group>
				}
				labelPosition="left"
			/>
			<Group align="flex-end" gap="lg">
				<TextInput
					label="Add Invoice Item(s)"
					placeholder="e.g. Episode 1, Episode 2, Episode 3"
					description="Separate multiple items with a comma to add several items at once."
					value={newItemName}
					onChange={(e) => setNewItemName(e.currentTarget.value)}
					onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
					style={{ flex: 1 }}
					size="sm"
				/>
				<Button
					leftSection={<IconPlus size={16} />}
					onClick={handleAddItem}
					variant="filled"
					color="studio"
					size="md"
					disabled={!newItemName.trim()}
				>
					Add item
				</Button>
			</Group>
		</Paper>
	);
}
