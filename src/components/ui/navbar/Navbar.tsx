import { Anchor, Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import { Link, useLocation } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { LinkButton } from "../button/ButtonLink";
import { APP_SHELL_HEADER_HEIGHT } from "../layout/layout-constants";

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
				fw={600}
				style={{
					color: isActive
						? "var(--mantine-color-wave-8)"
						: "var(--mantine-color-gray-6)",
					backgroundColor: isActive
						? "color-mix(in srgb, var(--mantine-color-wave-8) 8%, white)"
						: "transparent",
					transition: "all 150ms ease",
					"&:hover": {
						backgroundColor: isActive
							? "color-mix(in srgb, var(--mantine-color-wave-8) 12%, white)"
							: "var(--mantine-color-gray-0)",
						color: isActive
							? "var(--mantine-color-wave-9)"
							: "var(--mantine-color-gray-8)",
					},
				}}
			>
				{link.label}
			</UnstyledButton>
		);
	});

	return (
		<Group
			h={APP_SHELL_HEADER_HEIGHT}
			justify="space-between"
			align="center"
			gap="md"
			flex={1}
		>
			<Group gap="sm">
				<Receipt
					size={28}
					strokeWidth={2}
					style={{ color: "var(--mantine-color-wave-8)" }}
				/>
				<Text
					size="xl"
					fw={800}
					c="gray.8"
					className="tracking-tighter"
					visibleFrom="xs"
				>
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
						<Avatar />
						<Text size="sm" fw={500}>
							{user.firstname} {user.lastname}
						</Text>
					</Group>
				</Anchor>
			)}
		</Group>
	);
}
