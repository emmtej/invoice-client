import {
	BackgroundImage,
	Badge,
	Box,
	Button,
	Grid,
	Group,
	Overlay,
	Paper,
	SimpleGrid,
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
			<Grid gutter={60} align="center">
				<Grid.Col span={{ base: 12, md: 5 }}>
					<Stack gap="xl">
						<div>
							<Badge variant="dot" color="studio" size="lg" mb="md">
								Studio-ready workflow
							</Badge>
							<Title order={1} size={56} fw={900} style={{ lineHeight: 1.1 }}>
								From script to
								<br />
								<Text component="span" inherit c="studio.5">
									professional invoice
								</Text>
							</Title>
						</div>
						<Text c="gray.6" size="lg">
							InVoice handles the word counts so you can focus on the
							performance. Automated parsing for DOCX and text scripts.
						</Text>
						<Group gap="md">
							<Button
								component={Link}
								to="/register"
								size="xl"
								radius="md"
								color="wave"
								onMouseEnter={() => initDb()}
							>
								Create Account
							</Button>
							<Button
								component={Link}
								to="/editor"
								size="xl"
								radius="md"
								variant="light"
								color="gray"
								onMouseEnter={() => initDb()}
							>
								Try Editor
							</Button>
						</Group>
					</Stack>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 7 }}>
					<SimpleGrid cols={2} spacing="md">
						<Paper
							radius="2xl"
							p={0}
							withBorder
							style={{
								gridColumn: "span 2",
								overflow: "hidden",
								height: "300px",
							}}
						>
							<BackgroundImage src={invoice1} h="100%">
								<Box p="xl" h="100%" pos="relative">
									<Overlay color="#000" opacity={0.3} zIndex={1} />
									<Stack
										h="100%"
										justify="flex-end"
										pos="relative"
										style={{ zIndex: 2 }}
									>
										<Badge variant="filled" color="wave" w="fit-content">
											Preview
										</Badge>
										<Text fw={700} c="white" size="xl">
											Visual script tracking
										</Text>
									</Stack>
								</Box>
							</BackgroundImage>
						</Paper>
						<Paper radius="2xl" p="xl" bg="studio.0" withBorder>
							<ThemeIcon variant="light" color="studio" size="lg" radius="md">
								<Mic size={20} />
							</ThemeIcon>
							<Text fw={700} mt="md">
								Booth Mode
							</Text>
							<Text size="sm" c="gray.6">
								Teleprompter tools for sessions.
							</Text>
						</Paper>
						<Paper radius="2xl" p="xl" bg="wave.0" withBorder>
							<ThemeIcon variant="light" color="wave" size="lg" radius="md">
								<Receipt size={20} />
							</ThemeIcon>
							<Text fw={700} mt="md">
								Smart Billing
							</Text>
							<Text size="sm" c="gray.6">
								Word-count based lines.
							</Text>
						</Paper>
					</SimpleGrid>
				</Grid.Col>
			</Grid>
		</section>
	);
}
