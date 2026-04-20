import {
	Anchor,
	Box,
	Button,
	Divider,
	Grid,
	Group,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import {
	Activity,
	CircleDashed,
	LayoutDashboard,
	Mic,
	Pencil,
	Receipt,
	User,
} from "lucide-react";
import { initDb } from "@/features/storage/pgliteClient";
import { LandingHero } from "./components/LandingHero";

const features = [
	{
		icon: Mic,
		title: "Built for voice talent",
		description:
			"Line-item invoicing tuned for sessions, pickups, and script-based word counts—so you bill accurately without spreadsheet gymnastics.",
	},
	{
		icon: Activity,
		title: "Script-aware workflow",
		description:
			"Parse and review scripts in one place, then flow dialogue counts straight into your invoice items.",
	},
	{
		icon: CircleDashed,
		title: "Calm, focused UI",
		description:
			"A soft, distraction-free workspace that stays out of your way when you are juggling auditions and deadlines.",
	},
	{
		icon: Receipt,
		title: "Professional summaries",
		description:
			"Export clear invoice summaries you can share with clients or drop into your accounting stack.",
	},
];

const tools = [
	{
		title: "Script Editor",
		description: "Parse scripts and track dialogue",
		icon: Pencil,
		to: "/editor",
		color: "wave" as const,
	},
	{
		title: "Invoices",
		description: "Build and export invoice lines",
		icon: Receipt,
		to: "/invoice",
		color: "wave" as const,
	},
	{
		title: "Dashboard",
		description: "Your hub for recent activity",
		icon: LayoutDashboard,
		to: "/dashboard",
		color: "gray" as const,
	},
	{
		title: "Profile",
		description: "Account and defaults",
		icon: User,
		to: "/profile",
		color: "studio" as const,
	},
];

const footerLinks = [
	{
		title: "Product",
		links: [
			{ label: "Editor", to: "/editor" },
			{ label: "Invoices", to: "/invoice" },
			{ label: "Dashboard", to: "/dashboard" },
		],
	},
	{
		title: "Resources",
		links: [
			{ label: "Documentation", to: "/" },
			{ label: "API Reference", to: "/" },
			{ label: "Community", to: "/" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About Us", to: "/" },
			{ label: "Careers", to: "/" },
			{ label: "Contact", to: "/" },
		],
	},
];

export default function HomePage() {
	const featureIcons: Array<"studio" | "wave" | "gray"> = [
		"wave",
		"wave",
		"gray",
		"studio",
	];

	const featureItems = features.map((feature, i) => (
		<div key={feature.title}>
			<ThemeIcon size={44} variant="light" color={featureIcons[i] ?? "wave"}>
				<feature.icon size={26} strokeWidth={1.5} />
			</ThemeIcon>
			<Text fz="lg" mt="sm" fw={500}>
				{feature.title}
			</Text>
			<Text c="gray.5" fz="sm" lh={1.6}>
				{feature.description}
			</Text>
		</div>
	));

	const toolItems = tools.map((tool) => (
		<Paper
			key={tool.title}
			component={Link}
			to={tool.to}
			withBorder
			p="md"
			onMouseEnter={() => initDb()}
			style={{
				transition: "transform 200ms ease, box-shadow 200ms ease",
				cursor: "pointer",
				textDecoration: "none",
				color: "inherit",
			}}
			className="hover:-translate-y-1 hover:shadow-md"
		>
			<Group wrap="nowrap">
				<ThemeIcon color={tool.color} variant="light" size="xl">
					<tool.icon size={24} />
				</ThemeIcon>
				<div>
					<Text fw={600} size="sm">
						{tool.title}
					</Text>
					<Text size="xs" c="gray.5">
						{tool.description}
					</Text>
				</div>
			</Group>
		</Paper>
	));

	return (
		<Stack gap={100} pb={40}>
			<LandingHero />

			<section>
				<Stack gap="xl">
					<div>
						<Title
							order={2}
							size="32px"
							className="tracking-tight text-balance"
						>
							Quick access
						</Title>
						<Text c="gray.5" size="lg" className="text-pretty">
							Jump straight into your workflow
						</Text>
					</div>
					<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
						{toolItems}
					</SimpleGrid>
				</Stack>
			</section>

			<section>
				<Grid gutter={60}>
					<Grid.Col span={{ base: 12, md: 5 }}>
						<Title
							order={2}
							size="32px"
							className="tracking-tight text-balance"
							mb="md"
						>
							Everything you need to bill with confidence
						</Title>
						<Text c="gray.5" mb="lg" size="lg" className="text-pretty">
							Whether you are recording from a home booth or a studio session,
							InVoice keeps your script data and invoice math aligned—without
							switching between a dozen browser tabs.
						</Text>

						<Button
							variant="outline"
							color="wave"
							size="md"
							component={Link}
							to="/dashboard"
						>
							View dashboard
						</Button>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 7 }}>
						<SimpleGrid cols={{ base: 1, sm: 2 }} spacing={40}>
							{featureItems}
						</SimpleGrid>
					</Grid.Col>
				</Grid>
			</section>

			<Box pt={40}>
				<Divider mb={60} />
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
							Billing and script tools for voice actors—soft on the eyes, sharp
							on the details.
						</Text>
						<Text size="xs" c="gray.5">
							© 2026 InVoice Platform. All rights reserved.
						</Text>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 8 }}>
						<SimpleGrid cols={{ base: 2, sm: 3 }}>
							{footerLinks.map((group) => (
								<Stack key={group.title} gap="xs">
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
						</SimpleGrid>
					</Grid.Col>
				</Grid>
			</Box>
		</Stack>
	);
}
