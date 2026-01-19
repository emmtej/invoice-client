import { Login } from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";
import {
	Button,
	Card,
	Container,
	Divider,
	Group,
	SegmentedControl,
} from "@mantine/core";
import {
	IconBrandAppleFilled,
	IconBrandGoogleFilled,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "@tanstack/react-router";

function Authentication() {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const activeTab = pathname.includes("register") ? <Register /> : <Login />;

	const handleTabChange = (value: string) => {
		navigate({ to: `/${value}` });
	};
	return (
		<Container className="flex flex-col">
			<SegmentedControl
				onChange={handleTabChange}
				data={[
					{ label: "Login", value: "login" },
					{ label: "Register", value: "register" },
				]}
				mb={20}
			/>
			<Card
				shadow="none"
				padding="lg"
				radius="md"
				withBorder
				className="min-h-fit"
			>
				<Card.Section>{activeTab}</Card.Section>
				<Divider my="md" label="Or continue with" />
				<Group>
					<Button
						leftSection={<IconBrandGoogleFilled size={14} />}
						variant="default"
						fullWidth
					>
						Google
					</Button>
					<Button
						leftSection={<IconBrandAppleFilled size={14} />}
						variant="default"
						fullWidth
					>
						Apple
					</Button>
				</Group>
			</Card>
		</Container>
	);
}

export default Authentication;
