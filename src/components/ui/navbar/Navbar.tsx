import { Anchor, Avatar, Box, Group, Text, UnstyledButton } from "@mantine/core";
import { Link, useLocation } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { LinkButton } from "../button/ButtonLink";

const links = [{ link: "/invoice", label: "Invoices" }];

export function Navbar() {
	const user = useUserStore((store) => store.user);
	const { pathname } = useLocation();

	const items = links.map((link) => {
		const isActive =
			pathname === link.link || pathname.startsWith(`${link.link}/`);
		return (
			<UnstyledButton
				key={link.label}
				component={Link}
				to={link.link}
				py="xs"
				px="sm"
				fz="sm"
				fw={500}
				style={(theme) => ({
					borderRadius: theme.radius.sm,
					color: isActive
						? "var(--mantine-color-primary-6)"
						: "var(--mantine-color-gray-7)",
					backgroundColor: isActive
						? "var(--mantine-color-primary-0)"
						: undefined,
					"&:hover": {
						backgroundColor: isActive
							? "var(--mantine-color-primary-1)"
							: "var(--mantine-color-gray-0)",
					},
				})}
			>
				{link.label}
			</UnstyledButton>
		);
	});

	return (
		<Box
			component="header"
			h={60}
			w="100%"
			bg="white"
			px="lg"
			style={{
				borderBottom: "1px solid var(--mantine-color-gray-2)",
			}}
		>
			<Group h={60} justify="space-between" align="center" gap="md">
				<Group gap="sm">
					<Receipt
						size={24}
						strokeWidth={1.5}
						style={{ color: "var(--mantine-color-primary-6)" }}
					/>
					<Text size="sm" fw={600} c="dark.9" visibleFrom="xs">
						InVoice
					</Text>
				</Group>

				{user === null ? (
					<Group gap="sm">
						<Group gap="xs" visibleFrom="sm">
							{items}
						</Group>
						<LinkButton to="/login" variant="default">
							Log in
						</LinkButton>
						<LinkButton to="/register" variant="filled">
							Sign up
						</LinkButton>
					</Group>
				) : (
					<Anchor component={Link} to="/profile">
						<Group gap="xs">
							<Avatar radius="xl" />
							<Text size="sm" fw={500}>
								{user.firstname} {user.lastname}
							</Text>
						</Group>
					</Anchor>
				)}
			</Group>
		</Box>
	);
}
