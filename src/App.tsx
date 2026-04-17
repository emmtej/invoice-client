import {
	Anchor,
	Badge,
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
import { useId } from "react";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { initDb } from "@/features/storage/pgliteClient";

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

function HeroPreviewMock() {
	const waveFillId = useId().replace(/:/g, "");
	const waveformPath =
		"M0,42 Q25,18 50,38 T100,32 T150,48 T200,28 T250,44 T300,24 T350,40 T400,36";

	return (
		<Paper
			shadow="xl"
			withBorder
			p="md"
			style={{
				background:
					"light-dark(var(--mantine-color-body), var(--mantine-color-dark-7))",
			}}
		>
			<Stack gap="md">
				<Group justify="space-between" align="center" wrap="nowrap">
					<Badge variant="light" color="wave" size="lg">
						Invoice & sessions
					</Badge>
					<Text size="xs" c="gray.5" fw={500}>
						Preview
					</Text>
				</Group>
				<Box
					p="md"
					style={{
						background:
							"linear-gradient(135deg, color-mix(in srgb, var(--mantine-color-studio-2) 55%, transparent) 0%, color-mix(in srgb, var(--mantine-color-wave-2) 50%, transparent) 100%)",
					}}
				>
					<svg
						width="100%"
						height={100}
						viewBox="0 0 400 80"
						preserveAspectRatio="none"
						aria-hidden
					>
						<title>Waveform preview</title>
						<defs>
							<linearGradient id={waveFillId} x1="0%" y1="0%" x2="100%" y2="0%">
								<stop
									offset="0%"
									stopColor="var(--mantine-color-studio-5)"
									stopOpacity={0.35}
								/>
								<stop
									offset="50%"
									stopColor="var(--mantine-color-wave-5)"
									stopOpacity={0.45}
								/>
								<stop
									offset="100%"
									stopColor="var(--mantine-color-studio-4)"
									stopOpacity={0.3}
								/>
							</linearGradient>
						</defs>
						<path
							d={`${waveformPath} L400,80 L0,80 Z`}
							fill={`url(#${waveFillId})`}
							opacity={0.9}
						/>
						<path
							d={waveformPath}
							fill="none"
							stroke="var(--mantine-color-wave-6)"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							opacity={0.85}
						/>
					</svg>
				</Box>
				<Group grow gap="xs">
					{["Session A", "Pickup", "ADR"].map((label) => (
						<Paper
							key={label}
							p="xs"
							withBorder
							bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
						>
							<Text size="xs" fw={600} c="gray.5" tt="uppercase">
								{label}
							</Text>
							<Text size="sm" fw={600}>
								—
							</Text>
						</Paper>
					))}
				</Group>
			</Stack>
		</Paper>
	);
}

export default function App() {
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
		<Stack gap={80} pb={40}>
			<section>
				<Grid gutter={40} align="center">
					<Grid.Col span={{ base: 12, md: 6 }}>
						<Stack gap="xl">
							<div>
								<Badge variant="light" color="wave" size="lg" mb="sm">
									Invoicing for voice actors
								</Badge>
								<PageTitle size={48} fw={900} style={{ lineHeight: 1.1 }}>
									Invoices and scripts,{" "}
									<Text
										component="span"
										inherit
										variant="gradient"
										gradient={{ from: "studio", to: "wave", deg: 105 }}
									>
										in one calm studio
									</Text>
								</PageTitle>
							</div>

							<Text c="gray.5" size="lg" lh={1.6} className="page-subtitle">
								InVoice helps you go from script to line items with less
								friction: parse dialogue, track word counts, and send clear
								invoices that match how you actually work.
							</Text>

							<Group gap="md">
								<Button
									component={Link}
									to="/register"
									variant="filled"
									color="wave"
									size="lg"
									onMouseEnter={() => initDb()}
								>
									Get started
								</Button>
								<Button
									component={Link}
									to="/editor"
									variant="light"
									color="wave"
									size="lg"
									onMouseEnter={() => initDb()}
								>
									Open script editor
								</Button>
							</Group>
						</Stack>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 6 }}>
						<HeroPreviewMock />
					</Grid.Col>
				</Grid>
			</section>

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
