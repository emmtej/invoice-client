import { Anchor, Card, Container, Divider, Flex, Title } from "@mantine/core";
import { Link, useLocation } from "@tanstack/react-router";
import { Login } from "@/components/auth/Login";
import { OAuthProviders } from "@/components/auth/OAuthProviders";
import { Register } from "@/components/auth/Register";

function Authentication() {
	const { pathname } = useLocation();
	const isRegistering = pathname.includes("register");
	const activeTab = isRegistering ? <Register /> : <Login />;
	return (
		<Container size="xs">
			<Flex justify="center" align="center" py="xl">
				<Card p="xl" maw={400} withBorder shadow="sm">
					<Card.Section>
						<Title order={2} mb="lg">
							{isRegistering ? "Sign Up" : "Login"}
						</Title>
						{activeTab}
					</Card.Section>
					<Card.Section py="xs" mt="md">
						<Anchor
							component={Link}
							to={isRegistering ? "/login" : "/register"}
							display="block"
							size="sm"
							c="violet.6"
						>
							{isRegistering
								? "Already have an account? Login"
								: "Don't have an account? Sign up"}
						</Anchor>
					</Card.Section>
					<Divider my="md" label="Or continue with" />
					<OAuthProviders />
				</Card>
			</Flex>
		</Container>
	);
}

export default Authentication;
