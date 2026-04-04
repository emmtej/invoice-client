import { Button, Group, TextInput } from "@mantine/core";
import { List, Plus } from "lucide-react";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { SectionDivider } from "@/components/ui/divider/SectionDivider";

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
		<SurfaceCard mt="xl">
			<SectionDivider icon={<List size={16} strokeWidth={1.5} />} mb="sm">
				Items
			</SectionDivider>
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
		</SurfaceCard>
	);
}
