import { ScrollArea } from "@mantine/core";
import {
	IconFileAnalytics,
	IconGauge,
	IconNotes,
	IconPresentationAnalytics,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/userStore";
import { LinksGroup } from "./NavLinksGroup";
import classes from "./Sidebar.module.css";
import { UserButton } from "./UserButton";

const navlinks = [
	{ label: "Home", icon: IconGauge },
	{ label: "Profile", icon: IconPresentationAnalytics, href: "/profile" },
	{
		label: "Invoice",
		icon: IconNotes,
		initiallyOpened: true,

		links: [
			{ label: "Overview", link: "/invoice" },
			{ label: "Create", link: "/invoice/create" },
			{ label: "Manage", link: "/invoice/manage" },
		],
	},
	{
		label: "Script Tools",
		icon: IconFileAnalytics,

		links: [
			{ label: "Editor", link: "/script/editor" },
			{ label: "Calculator", link: "/script/calculator" },
		],
	},
];

export function Sidebar() {
	const user = useUserStore((store) => store.user);

	const links = navlinks.map((item) => (
		<LinksGroup {...item} key={item.label} />
	));

	return (
		<nav className={classes.navbar}>
			<ScrollArea className={classes.links}>
				<div>{links}</div>
			</ScrollArea>

			{user && (
				<div className={classes.footer}>
					<UserButton user={user} />
				</div>
			)}
		</nav>
	);
}
