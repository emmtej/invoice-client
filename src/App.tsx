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
	Skeleton,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import {
	IconCircleDotted,
	IconDashboard,
	IconEdit,
	IconFileCode,
	IconFlame,
	IconReceipt,
	IconReceiptOff,
	IconUser,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

const features = [
	{
		icon: IconReceiptOff,
		title: "Free and open source",
		description:
			"All packages are published under MIT license, you can use InVoice in any project without restrictions.",
	},
	{
		icon: IconFileCode,
		title: "TypeScript Based",
		description:
			"Experience ultimate type safety and developer experience with our robust TS architecture.",
	},
	{
		icon: IconCircleDotted,
		title: "Seamless Experience",
		description:
			"A distraction-free interface designed for productivity and ease of use.",
	},
	{
		icon: IconFlame,
		title: "Powerful Parsing",
		description:
			"Automatically parse complex script formats and document structures with our custom engine.",
	},
];

const tools = [
	{
		title: "Script Editor",
		description: "Advanced script parsing and editing",
		icon: IconEdit,
		to: "/editor",
		color: "violet",
	},
	{
		title: "Invoice Tool",
		description: "Manage and generate professional invoices",
		icon: IconReceipt,
		to: "/invoice",
		color: "blue",
	},
	{
		title: "Dashboard",
		description: "Overview of your recent activity",
		icon: IconDashboard,
		to: "/dashboard",
		color: "teal",
	},
	{
		title: "Profile",
		description: "Manage your account settings",
		icon: IconUser,
		to: "/profile",
		color: "orange",
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

export default function App() {
	const featureItems = features.map((feature) => (
		<div key={feature.title}>
			<ThemeIcon size={44} radius="md" variant="light" color="violet">
				<feature.icon size={26} stroke={1.5} />
			</ThemeIcon>
			<Text fz="lg" mt="sm" fw={500}>
				{feature.title}
			</Text>
			<Text c="dimmed" fz="sm" lh={1.6}>
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
			radius="md"
			style={{
				transition: "transform 200ms ease, box-shadow 200ms ease",
				cursor: "pointer",
				textDecoration: "none",
				color: "inherit",
			}}
			className="hover:-translate-y-1 hover:shadow-md"
		>
			<Group wrap="nowrap">
				<ThemeIcon color={tool.color} variant="light" size="xl" radius="md">
					<tool.icon size={24} />
				</ThemeIcon>
				<div>
					<Text fw={600} size="sm">
						{tool.title}
					</Text>
					<Text size="xs" c="dimmed">
						{tool.description}
					</Text>
				</div>
			</Group>
		</Paper>
	));

	return (
		<Stack gap={80} pb={40}>
			{/* Hero Section */}
			<section>
				<Grid gutter={40} align="center">
					<Grid.Col span={{ base: 12, md: 6 }}>
						<Stack gap="xl">
							<div>
								<Badge variant="light" color="violet" size="lg" mb="sm">
									New Version 2.0
								</Badge>
								<Title order={1} size={48} fw={900} style={{ lineHeight: 1.1 }}>
									The modern platform for{" "}
									<Text
										component="span"
										inherit
										variant="gradient"
										gradient={{ from: "violet", to: "blue" }}
									>
										Script & Document
									</Text>{" "}
									Management
								</Title>
							</div>

							<Text c="dimmed" size="lg" lh={1.6}>
								InVoice provides a comprehensive suite of tools for parsing,
								editing, and managing your scripts and invoices. Built for
								speed, precision, and ease of use.
							</Text>

							<Group gap="md">
								<Button
									component={Link}
									to="/register"
									variant="filled"
									size="lg"
									radius="md"
								>
									Get Started
								</Button>
								<Button
									component={Link}
									to="/editor"
									variant="light"
									size="lg"
									radius="md"
								>
									Try the Editor
								</Button>
							</Group>
						</Stack>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 6 }}>
						<Paper shadow="xl" radius="lg" withBorder p="xs">
							<Skeleton height={320} radius="md" animate={false}>
								<Box
									h="100%"
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										background: "rgba(0,0,0,0.05)",
									}}
								>
									<Text c="dimmed" fw={500}>
										Application Interface Preview
									</Text>
								</Box>
							</Skeleton>
						</Paper>
					</Grid.Col>
				</Grid>
			</section>

			{/* Submenu / Tool Shortcuts */}
			<section>
				<Stack gap="xl">
					<div>
						<Title order={2} size="h3" mb="xs">
							Quick Access
						</Title>
						<Text c="dimmed">Jump directly to your favorite tools</Text>
					</div>
					<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
						{toolItems}
					</SimpleGrid>
				</Stack>
			</section>

			{/* Features Section */}
			<section>
				<Grid gutter={60}>
					<Grid.Col span={{ base: 12, md: 5 }}>
						<Title order={2} mb="md">
							A fully featured ecosystem for document processing
						</Title>
						<Text c="dimmed" mb="lg" size="md">
							Mantine includes more than 120 customizable components and hooks
							to cover you in any situation. InVoice leverages these to provide
							a seamless editing experience.
						</Text>

						<Button
							variant="outline"
							size="md"
							radius="md"
							component={Link}
							to="/dashboard"
						>
							View Dashboard
						</Button>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 7 }}>
						<SimpleGrid cols={{ base: 1, sm: 2 }} spacing={40}>
							{featureItems}
						</SimpleGrid>
					</Grid.Col>
				</Grid>
			</section>

			{/* Footer Section */}
			<Box pt={40}>
				<Divider mb={60} />
				<Grid gutter={40}>
					<Grid.Col span={{ base: 12, md: 4 }}>
						<Group gap="xs" mb="md">
							<IconReceipt
								size={30}
								stroke={1.5}
								style={{ color: "var(--mantine-color-violet-6)" }}
							/>
							<Text size="xl" fw={700}>
								InVoice
							</Text>
						</Group>
						<Text size="sm" c="dimmed" maw={300} mb="xl">
							Streamlining script parsing and document management for creative
							professionals and businesses.
						</Text>
						<Text size="xs" c="dimmed">
							© 2026 InVoice Platform. All rights reserved.
						</Text>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 8 }}>
						<SimpleGrid cols={{ base: 2, sm: 3 }}>
							{footerLinks.map((group) => (
								<Stack key={group.title} gap="xs">
									<Text fw={700} size="sm" mb="xs">
										{group.title}
									</Text>
									{group.links.map((link) => (
										<Anchor
											key={link.label}
											component={Link}
											to={link.to}
											size="sm"
											c="dimmed"
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
