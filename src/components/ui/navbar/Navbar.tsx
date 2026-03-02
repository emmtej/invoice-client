import { Anchor, Avatar, Group, Stack, Text } from "@mantine/core";
import { useUserStore } from "@/store/userStore";
import { LinkButton } from "../button/ButtonLink";
import classes from "./Navbar.module.css";
import { Link } from "@tanstack/react-router";

// TODO: Create single repo for navlinks
const links = [
	{ link: "/invoice", label: "Invoices" },
	{ link: "/scripts", label: "Script Tools" },
	{ link: "/tools", label: "Tools" },
];

export function Navbar() {
	const user = useUserStore((store) => store.user);

	const items = links.map((link) => (
		<Anchor key={link.label} href={link.link} className={classes.link}>
			{link.label}
		</Anchor>
	));

	const navAuthLinks = () => {};

	return (
		<header className={classes.header}>
			<div className={classes.inner}>
				<Group>
					<div>logo</div>
				</Group>

				{user === null ? (
					<Group gap={"xs"}>
						<Group ml={50} gap={1} className={classes.links} visibleFrom="sm">
							{items}
						</Group>
						<LinkButton to="/login" variant="default">
							Log in
						</LinkButton>
						<LinkButton to="/register">Sign up</LinkButton>
					</Group>
				) : (
					<Anchor component={Link} to="/profile">
						<Group gap={"xs"}>
							<Avatar radius="xl" />
							<Text>
								{user.firstname} {user.lastname}
							</Text>
						</Group>
					</Anchor>
				)}
			</div>
		</header>
	);
}
