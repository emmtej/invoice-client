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
					label="Add Project Item"
					placeholder="e.g. Episode 1"
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
					color="wave"
					size="sm"
					disabled={!newItemName.trim()}
				>
					Add item
				</Button>
			</Group>
		</SurfaceCard>
	);
}
