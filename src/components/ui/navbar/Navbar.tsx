import {
	Anchor,
	Avatar,
	Group,
	Text,
	Title,
	UnstyledButton,
} from "@mantine/core";
import { Link, useLocation } from "@tanstack/react-router";
import { useUserStore } from "@/features/user/store/userStore";
import { LinkButton } from "../button/ButtonLink";
import { APP_SHELL_HEADER_HEIGHT } from "../layout/layout-constants";

const links: { link: string; label: string }[] = [];

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
			<UnstyledButton
				component={Link}
				to="/"
				style={{
					display: "flex",
					alignItems: "center",
					textDecoration: "none",
					color: "inherit",
				}}
			>
				<Title
					order={3}
					c="forest.9"
					style={{
						display: "flex",
						alignItems: "baseline",
						lineHeight: 1,
					}}
				>
					<span
						style={{
							fontWeight: 900,
							letterSpacing: "-0.08em",
						}}
					>
						In
					</span>
					<span
						style={{
							fontStyle: "italic",
							fontWeight: 900,
							color: "var(--mantine-color-wave-8)",
							fontSize: "1.4em",
							margin: "0 -0.04em",
							position: "relative",
							top: "0.02em",
							zIndex: 1,
						}}
					>
						V
					</span>
					<span
						style={{
							fontWeight: 400,
							letterSpacing: "0.12em",
							fontFamily: "var(--mantine-font-family)",
							color: "var(--mantine-color-gray-6)",
							fontSize: "0.85em",
						}}
					>
						oice
					</span>
				</Title>
			</UnstyledButton>

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
