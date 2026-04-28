import { Anchor, Box, Grid, Group, Stack, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Receipt } from "lucide-react";

const footerLinks = [
	{
		title: "Invoicing",
		links: [
			{ label: "New Invoice", to: "/invoice" },
			{ label: "Presets", to: "/invoice/presets" },
			{ label: "Billing Profile", to: "/profile" },
		],
	},
	{
		title: "Tools",
		links: [
			{ label: "Recording Booth", to: "/booth" },
			{ label: "Script Tools", to: "/scripts" },
			{ label: "Workspace", to: "/editor" },
		],
	},
];

export function AppFooter() {
	return (
		<Box>
			<Grid gutter={40}>
				<Grid.Col span={{ base: 12, md: 4 }}>
					<Group gap="xs" mb="md">
						<Receipt
							size={30}
							strokeWidth={2}
							style={{ color: "var(--mantine-color-wave-8)" }}
						/>
						<Text size="xl" fw={800} c="gray.8" className="tracking-tighter">
							InVoice
						</Text>
					</Group>
					<Text size="sm" c="gray.5" maw={300} mb="xl">
						Billing and script tools for voice actors—soft on the eyes, sharp on
						the details.
					</Text>
					<Text size="xs" c="gray.5">
						© 2026 InVoice Platform. All rights reserved.
					</Text>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 8 }}>
					<Group justify="flex-end" align="flex-start" gap={80}>
						{footerLinks.map((group) => (
							<Stack key={group.title} gap="xs" miw={120}>
								<Text fw={600} size="sm" mb="xs">
									{group.title}
								</Text>
								{group.links.map((link) => (
									<Anchor
										key={link.label}
										component={Link}
										to={link.to}
										size="sm"
										c="gray.5"
										underline="hover"
									>
										{link.label}
									</Anchor>
								))}
							</Stack>
						))}
					</Group>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
