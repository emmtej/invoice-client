import { Anchor, Button, Group } from "@mantine/core";

import { useUserStore } from "@/store/userStore";
import classes from "./Navbar.module.css";

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

	return (
		<header className={classes.header}>
			<div className={classes.inner}>
				<Group>
					<div>logo</div>
				</Group>

				<Group>
					<Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
						{items}
					</Group>
					<Button variant="default">Log in</Button>
					<Button>Sign up</Button>
				</Group>
			</div>
		</header>
	);
}
