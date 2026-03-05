import { Anchor, Avatar, Group, Text } from "@mantine/core";
import { IconReceipt } from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useUserStore } from "@/store/userStore";
import { LinkButton } from "../button/ButtonLink";
import classes from "./Navbar.module.css";

// TODO: Create single repo for navlinks
const links = [
	{ link: "/invoice", label: "Invoices" },
	{ link: "/scripts", label: "Script Tools" },
	{ link: "/tools", label: "Tools" },
];

export function Navbar() {
	const user = useUserStore((store) => store.user);
	const { pathname } = useLocation();

	const items = links.map((link) => {
		const isActive =
			pathname === link.link || pathname.startsWith(link.link + "/");
		return (
			<Anchor
				key={link.label}
				component={Link}
				to={link.link}
				className={`${classes.link} ${isActive ? classes.linkActive : ""}`}
			>
				{link.label}
			</Anchor>
		);
	});

	return (
		<header className={classes.header}>
			<div className={classes.inner}>
				<Group gap="sm">
					<IconReceipt
						size={24}
						stroke={1.5}
						style={{ color: "var(--mantine-color-violet-6)" }}
					/>
					<Text size="sm" fw={600} c="dark.9" visibleFrom="xs">
						InVoice
					</Text>
				</Group>

				{user === null ? (
					<Group gap="sm">
						<Group gap="xs" className={classes.links} visibleFrom="sm">
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
			</div>
		</header>
	);
}
