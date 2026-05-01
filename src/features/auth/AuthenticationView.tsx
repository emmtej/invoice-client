import {
	Alert,
	Anchor,
	Box,
	Divider,
	Flex,
	Paper,
	SegmentedControl,
	Text,
} from "@mantine/core";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { OAuthProviders } from "@/features/auth/components/OAuthProviders";

function AuthenticationView() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const isRegistering = pathname.includes("register");

	const handleModeChange = (value: string) => {
		if (value === "login") {
			void navigate({ to: "/login", replace: true });
		} else {
			void navigate({ to: "/register", replace: true });
		}
	};

	return (
		<Flex justify="center" align="center" py="xl" flex={1}>
			<Paper
				bg="white"
				display="flex"
				style={{ overflow: "hidden", minHeight: 650 }}
				w="100%"
				maw={1000}
			>
				{/* Left Form Column */}
				<Box
					p={{ base: "xl", md: 60 }}
					w={{ base: "100%", md: "50%" }}
					display="flex"
					style={{ flexDirection: "column", justifyContent: "center" }}
				>
					{import.meta.env.VITE_DEMO_MODE === "true" && (
						<Alert
							icon={<Info size={16} />}
							title="Demo Mode"
							color="wave"
							variant="light"
							mb="xl"
						>
							Use{" "}
							<Text span fw={700}>
								test@example.com
							</Text>{" "}
							to log in. This is a mock authentication for demo purposes.
						</Alert>
					)}
					<Box mb={40}>
						<PageTitle size="42px">Get Started with InVoice</PageTitle>
						<Text c="gray.5" mt="sm" size="lg" className="page-subtitle">
							Professional script management and word-count based invoicing for
							voice artists.
						</Text>
					</Box>

					<SegmentedControl
						value={isRegistering ? "register" : "login"}
						onChange={handleModeChange}
						data={[
							{ label: "Log in", value: "login" },
							{ label: "Sign up", value: "register" },
						]}
						fullWidth
						mb="xl"
						size="md"
					/>
					<AuthForm mode={isRegistering ? "register" : "login"} />
					<Box py="xs" mt="sm">
						<Anchor
							component={Link}
							to={isRegistering ? "/login" : "/register"}
							display="block"
							size="sm"
							c="wave.7"
						>
							{isRegistering
								? "Already have an account? Login"
								: "Don't have an account? Sign up"}
						</Anchor>
					</Box>
					<Divider my="md" label="Or continue with" />
					<OAuthProviders />
				</Box>

				{/* Right Image Column */}
				<Box
					w={{ base: "0%", md: "50%" }}
					display={{ base: "none", md: "block" }}
					style={{ position: "relative" }}
				>
					<Flex
						h="100%"
						w="100%"
						bg="gray.0"
						direction="column"
						align="center"
						justify="center"
						style={{ color: "var(--mantine-color-gray-4)" }}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							style={{ marginBottom: "1rem" }}
							role="img"
						>
							<title>Image Placeholder</title>
							<rect width="18" height="18" x="3" y="3" rx="0" ry="0" />{" "}
							<circle cx="9" cy="9" r="2" />
							<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
						</svg>
						<Text size="lg" fw={600} c="gray.5">
							Image Placeholder
						</Text>
					</Flex>
				</Box>
			</Paper>
		</Flex>
	);
}

export default AuthenticationView;
