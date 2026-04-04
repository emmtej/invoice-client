import { Button, Divider, Group, Paper, Text, TextInput } from "@mantine/core";
import { List, Plus } from "lucide-react";

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
			p="lg"
			radius="md"
			mt="xl"
			className="bg-white border border-slate-100"
		>
			<Divider
				mb="sm"
				label={
					<Group gap="xs">
						<List size={16} strokeWidth={1.5} />
						<Text fw={800} size="sm" tt="uppercase" lts={1}>
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
					leftSection={<Plus size={16} />}
					onClick={handleAddItem}
					variant="filled"
					color="studio"
					size="sm"
					disabled={!newItemName.trim()}
					radius="md"
				>
					Add item
				</Button>
			</Group>
		</Paper>
	);
}
