import { Anchor, Card, Container, Divider, Title } from "@mantine/core";
import { Link, useLocation } from "@tanstack/react-router";
import { Login } from "@/components/auth/Login";
import { OAuthProviders } from "@/components/auth/OAuthProviders";
import { Register } from "@/components/auth/Register";

function Authentication() {
	const { pathname } = useLocation();
	const isRegistering = pathname.includes("register");
	const activeTab = isRegistering ? <Register /> : <Login />;
	return (
		<Container className="flex flex-col items-center">
			<Card className="min-h-fit w-160 max-w-160" p={50} withBorder>
				<Card.Section>
					<Title order={2} mb={20}>
						{isRegistering ? "Sign Up" : "Login"}
					</Title>
					{activeTab}
				</Card.Section>
				<Card.Section py="xs" mt="sm">
					<Anchor
						component={Link}
						to={isRegistering ? "/login" : "/register"}
						display="block"
						size="sm"
					>
						{isRegistering
							? "Already have an account? Login"
							: "Don't have an account? Sign up"}
					</Anchor>
				</Card.Section>
				<Divider my="md" label="Or continue with" />
				<OAuthProviders />
			</Card>
		</Container>
	);
}

export default Authentication;
