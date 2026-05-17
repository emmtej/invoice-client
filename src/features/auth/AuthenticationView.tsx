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
				className="flex overflow-hidden min-h-[650px] w-full max-w-[1000px] border shadow-xl"
			>
				{/* Left Form Column */}
				<Box
					p={{ base: "xl", md: 60 }}
					w={{ base: "100%", md: "50%" }}
					className="flex flex-col justify-center"
				>
					{import.meta.env.VITE_DEMO_MODE === "true" && (
						<Alert
							icon={<Info size={16} />}
							title="Demo Mode"
							color="blue"
							variant="light"
							mb="xl"
							radius="md"
							className="border"
						>
							Use{" "}
							<Text span fw={700}>
								test@example.com
							</Text>{" "}
							to log in. This is a mock authentication for demo purposes.
						</Alert>
					)}
					<Box mb={40}>
						<PageTitle>Get Started with InVoice</PageTitle>
						<Text c="dimmed" mt="sm" size="lg">
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
						radius="xl"
						color="blue"
					/>
					<AuthForm mode={isRegistering ? "register" : "login"} />
					<Box py="xs" mt="sm">
						<Anchor
							component={Link}
							to={isRegistering ? "/login" : "/register"}
							className="block text-sm font-semibold"
						>
							{isRegistering
								? "Already have an account? Login"
								: "Don't have an account? Sign up"}
						</Anchor>
					</Box>
					<Divider
						my="md"
						label="Or continue with"
					/>
					<OAuthProviders />
				</Box>

				{/* Right Image Column */}
				<Box
					w={{ base: "0%", md: "50%" }}
					className="hidden md:block relative border-l"
				>
					<Flex
						h="100%"
						w="100%"
						direction="column"
						align="center"
						justify="center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mb-4"
							role="img"
						>
							<title>Image Placeholder</title>
							<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
							<circle cx="9" cy="9" r="2" />
							<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
						</svg>
						<Text size="lg" fw={700} c="dimmed">
							Professional Studio Interface
						</Text>
					</Flex>
				</Box>
			</Paper>
		</Flex>
	);
}
export default AuthenticationView;
