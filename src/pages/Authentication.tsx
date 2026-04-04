import {
	Anchor,
	Box,
	Container,
	Divider,
	Flex,
	Paper,
	Title,
} from "@mantine/core";
import { Link, useLocation } from "@tanstack/react-router";
import { useId } from "react";
import { Login } from "@/components/auth/Login";
import { OAuthProviders } from "@/components/auth/OAuthProviders";
import { Register } from "@/components/auth/Register";

const waveformPath =
	"M0,50 Q40,12 80,44 T160,28 T240,52 T320,20 T400,40 L400,80 L0,80 Z";

function Authentication() {
	const authWaveGradId = useId().replace(/:/g, "");
	const { pathname } = useLocation();
	const isRegistering = pathname.includes("register");
	const activeTab = isRegistering ? <Register /> : <Login />;
	return (
		<Box
			style={{
				minHeight: "100dvh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				position: "relative",
				overflow: "hidden",
				background:
					"linear-gradient(165deg, color-mix(in srgb, var(--mantine-color-studio-1) 20%, var(--app-bg)) 0%, color-mix(in srgb, var(--mantine-color-wave-1) 15%, var(--app-bg)) 45%, var(--app-bg) 100%)",
			}}
		>
			<Box
				pos="absolute"
				bottom={0}
				left={0}
				right={0}
				h={140}
				style={{ pointerEvents: "none", opacity: 0.18 }}
			>
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 400 80"
					preserveAspectRatio="none"
					aria-hidden
				>
					<title>Decoration</title>
					<defs>
						<linearGradient
							id={authWaveGradId}
							x1="0%"
							y1="0%"
							x2="100%"
							y2="0%"
						>
							<stop offset="0%" stopColor="var(--mantine-color-studio-5)" />
							<stop offset="100%" stopColor="var(--mantine-color-wave-5)" />
						</linearGradient>
					</defs>
					<path
						d={waveformPath}
						fill={`url(#${authWaveGradId})`}
						opacity={0.9}
					/>
				</svg>
			</Box>

			<Container size="xs" style={{ position: "relative", zIndex: 1 }}>
				<Flex justify="center" align="center" py="xl">
					<Paper
						p="xl"
						maw={400}
						w="100%"
						radius="md"
						className="bg-white border border-slate-100 shadow-sm"
					>
						<Box>
							<Title order={2} fw={800} size="h3" mb="lg">
								{isRegistering ? "Sign Up" : "Login"}
							</Title>
							{activeTab}
						</Box>
						<Box py="xs" mt="md">
							<Anchor
								component={Link}
								to={isRegistering ? "/login" : "/register"}
								display="block"
								size="sm"
								c="studio.6"
							>
								{isRegistering
									? "Already have an account? Login"
									: "Don't have an account? Sign up"}
							</Anchor>
						</Box>
						<Divider my="md" label="Or continue with" />
						<OAuthProviders />
					</Paper>
				</Flex>
			</Container>
		</Box>
	);
}

export default Authentication;
