import {
	BackgroundImage,
	Box,
	Button,
	Grid,
	Group,
	Overlay,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Mic, Receipt } from "lucide-react";
import invoice1 from "@/assets/images/invoice-1.jpg";
import { initDb } from "@/features/storage/pgliteClient";

export function LandingHero() {
	return (
		<section>
			<Grid gutter="md">
				{/* Large card on the left with image on right */}
				<Grid.Col span={{ base: 12, lg: 8 }}>
					<Paper
						radius="3xl"
						p={0}
						withBorder
						bg="brand-dark.9"
						className="relative h-[500px] overflow-hidden border-brand-dark-800"
					>
						{/* Image container positioned to the right */}
						<Box className="absolute inset-y-0 right-0 w-[70%] z-[1]">
							<BackgroundImage src={invoice1} h="100%" />
						</Box>

						{/* Overlay for text contrast - matching dark foam color */}
						<Overlay
							gradient="linear-gradient(90deg, var(--mantine-color-brand-dark-9) 0%, rgba(26, 27, 30, 0.9) 40%, rgba(26, 27, 30, 0) 100%)"
							zIndex={2}
						/>

						{/* Content container */}
						<Box p={40} h="100%" className="relative z-[3]">
							<Stack gap="xl" maw={420} h="100%" justify="center">
								<div>
									<Title
										order={1}
										size={44}
										className="leading-[1.1] font-semibold text-white"
									>
										From Script to
										<br />
										Professional Invoice
									</Title>
								</div>
								<Text c="white" size="md" fw={400} className="opacity-90">
									InVoice handles the word counts so you can focus on the
									performance. Automated parsing for DOCX and text scripts.
								</Text>
								<Group gap="md">
									<Button
										component={Link}
										to="/register"
										size="md"
										radius="xl"
										variant="filled"
										color="studio"
										onMouseEnter={() => initDb()}
									>
										Get Started
									</Button>
									<Button
										component={Link}
										to="/editor"
										size="md"
										radius="xl"
										variant="outline"
										onMouseEnter={() => initDb()}
										styles={{
											root: {
												color: "white",
												borderColor: "white",
												"&:hover": {
													backgroundColor: "rgba(255, 255, 255, 0.1)",
												},
											},
										}}
									>
										Try Editor
									</Button>
								</Group>
							</Stack>
						</Box>
					</Paper>
				</Grid.Col>

				{/* Stacked cards on the right */}
				<Grid.Col span={{ base: 12, lg: 4 }}>
					<Stack gap="md" h="100%">
						<Paper radius="3xl" p="xl" bg="studio.0" withBorder flex={1}>
							<Stack h="100%" justify="space-between">
								<ThemeIcon variant="light" color="studio" size="lg" radius="md">
									<Mic size={20} />
								</ThemeIcon>
								<div>
									<Text fw={700} size="lg" c="brand-dark.6">
										Booth Mode
									</Text>
									<Text size="sm" c="gray.6">
										Professional teleprompter tools designed for active
										recording sessions.
									</Text>
								</div>
							</Stack>
						</Paper>
						<Paper radius="3xl" p="xl" bg="wave.0" withBorder flex={1}>
							<Stack h="100%" justify="space-between">
								<ThemeIcon variant="light" color="wave" size="lg" radius="md">
									<Receipt size={20} />
								</ThemeIcon>
								<div>
									<Text fw={700} size="lg" c="brand-dark.6">
										Smart Billing
									</Text>
									<Text size="sm" c="gray.6">
										Generate invoices based on word-counts and custom line items
										automatically.
									</Text>
								</div>
							</Stack>
						</Paper>
					</Stack>
				</Grid.Col>
			</Grid>
		</section>
	);
}
