import { Box, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { Plus } from "lucide-react";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";

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
		<SurfaceCard
			p="xl"
			style={{
				backgroundColor: "white",
				border: "1px solid var(--mantine-color-gray-1)",
			}}
		>
			<Stack gap="lg">
				<Box>
					<Text fw={800} size="lg" c="gray.9">
						Add Project Category
					</Text>
					<Text size="sm" c="gray.7" mt={4}>
						Group your scripts into categories like "Commercials", "E-learning",
						or by Episode.
					</Text>
				</Box>
				<Group align="flex-end" gap="lg" maw={600}>
					<TextInput
						label="Category Name"
						placeholder="e.g. Episode 1, Radio Spots, etc."
						value={newItemName}
						onChange={(e) => setNewItemName(e.currentTarget.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
						style={{ flex: 1 }}
						size="md"
						styles={(theme) => ({
							label: { color: theme.colors.gray[8], marginBottom: 8 },
							input: { "&::placeholder": { color: theme.colors.gray[4] } },
						})}
					/>
					<Button
						leftSection={<Plus size={18} />}
						onClick={handleAddItem}
						variant="filled"
						color="studio-blue"
						size="md"
						disabled={!newItemName.trim()}
						fw={800}
						px="xl"
					>
						Add Category
					</Button>
				</Group>
			</Stack>
		</SurfaceCard>
	);
}
