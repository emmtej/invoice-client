import {
	Button,
	Grid,
	SimpleGrid,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import {
	IconCircleDotted,
	IconFileCode,
	IconFlame,
	IconReceiptOff,
} from "@tabler/icons-react";

const features = [
	{
		icon: IconReceiptOff,
		title: "Free and open source",
		description:
			"All packages are published under MIT license, you can use Mantine in any project",
	},
	{
		icon: IconFileCode,
		title: "TypeScript based",
		description:
			"Build type safe applications, all components and hooks export types",
	},
	{
		icon: IconCircleDotted,
		title: "No annoying focus ring",
		description:
			"With new :focus-visible selector focus ring will appear only when user navigates with keyboard",
	},
	{
		icon: IconFlame,
		title: "Flexible",
		description:
			"Customize colors, spacing, shadows, fonts and many other settings with global theme object",
	},
];

export default function App() {
	const items = features.map((feature) => (
		<div key={feature.title}>
			<ThemeIcon
				size={44}
				radius="md"
				variant="light"
				color="violet"
			>
				<feature.icon size={26} stroke={1.5} />
			</ThemeIcon>
			<Text fz="lg" mt="sm" fw={500}>
				{feature.title}
			</Text>
			<Text c="dimmed" fz="sm">
				{feature.description}
			</Text>
		</div>
	));

	return (
		<Grid pt="xl">
			<Grid.Col span={{ base: 12, md: 5 }}>
				<Title order={2} mb="md">
					A fully featured React components library for your next project
				</Title>
				<Text c="dimmed" mb="lg">
					Build fully functional accessible web applications faster than ever –
					Mantine includes more than 120 customizable components and hooks to
					cover you in any situation
				</Text>

				<Button variant="filled" size="lg" radius="md">
					Get started
				</Button>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 7 }}>
				<SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
					{items}
				</SimpleGrid>
			</Grid.Col>
		</Grid>
	);
}
