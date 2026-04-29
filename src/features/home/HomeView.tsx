import {
	Button,
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
		color: "on-air-red" as const,
	},
	{
		title: "Invoices",
		description: "Build and export invoice lines",
		icon: Receipt,
		to: "/invoice",
		color: "on-air-red" as const,
	},
	{
		title: "Dashboard",
		description: "Your hub for recent activity",
		icon: LayoutDashboard,
		to: "/dashboard",
		color: "brand-dark" as const,
	},
	{
		title: "Profile",
		description: "Account and defaults",
		icon: User,
		to: "/profile",
		color: "studio-blue" as const,
	},
];

export default function HomeView() {
	const featureIcons: Array<"studio-blue" | "on-air-red" | "brand-dark"> = [
		"on-air-red",
		"on-air-red",
		"brand-dark",
		"studio-blue",
	];

	const featureItems = features.map((feature, i) => (
		<Stack key={feature.title} gap="sm">
			<ThemeIcon size={48} variant="light" color={featureIcons[i] ?? "on-air-red"}>
				<feature.icon size={26} strokeWidth={2} />
			</ThemeIcon>
			<div>
				<Text fz="lg" fw={700} c="brand-dark.6">
					{feature.title}
				</Text>
				<Text c="brand-dark.4" fz="sm" lh={1.6}>
					{feature.description}
				</Text>
			</div>
		</Stack>
	));

	const toolItems = tools.map((tool) => (
		<Paper
			key={tool.title}
			component={Link}
			to={tool.to}
			withBorder
			p="lg"
			onMouseEnter={() => initDb()}
			className="interactive-card"
			style={{
				textDecoration: "none",
				color: "inherit",
			}}
		>
			<Group wrap="nowrap">
				<ThemeIcon color={tool.color} variant="light" size="xl">
					<tool.icon size={24} />
				</ThemeIcon>
				<div>
					<Text fw={700} size="sm" c="brand-dark.6">
						{tool.title}
					</Text>
					<Text size="xs" c="brand-dark.4">
						{tool.description}
					</Text>
				</div>
			</Group>
		</Paper>
	));

	return (
		<Stack gap={100} py={60}>
			<LandingHero />

			<section>
				<Stack gap="xl">
					<div>
						<Title
							order={2}
							size="32px"
							className="tracking-tight text-balance"
							c="brand-dark.6"
						>
							Quick access
						</Title>
						<Text c="brand-dark.4" size="lg" className="text-pretty">
							Jump straight into your workflow
						</Text>
					</div>
					<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
						{toolItems}
					</SimpleGrid>
				</Stack>
			</section>

			<section>
				<Stack gap={60}>
					<div className="text-center md:max-w-2xl md:mx-auto">
						<Title
							order={2}
							size="32px"
							className="tracking-tight text-balance"
							mb="md"
							c="brand-dark.6"
						>
							Everything you need to bill with confidence
						</Title>
						<Text c="brand-dark.4" size="lg" className="text-pretty">
							Whether you are recording from a home booth or a studio session,
							InVoice keeps your script data and invoice math aligned—without
							switching between a dozen browser tabs.
						</Text>
					</div>

					<SimpleGrid cols={{ base: 1, sm: 2 }} spacing={60}>
						{featureItems}
					</SimpleGrid>

					<div className="text-center">
						<Button
							variant="outline"
							size="lg"
							component={Link}
							to="/dashboard"
						>
							View dashboard
						</Button>
					</div>
				</Stack>
			</section>
		</Stack>
	);
}


