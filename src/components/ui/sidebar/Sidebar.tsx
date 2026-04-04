import { ScrollArea } from "@mantine/core";
import { FileText, LayoutDashboard, Receipt, User } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { LinksGroup } from "./NavLinksGroup";
import classes from "./Sidebar.module.css";
import { UserButton } from "./UserButton";

const navlinks = [
	{ label: "Home", icon: LayoutDashboard },
	{ label: "Profile", icon: User, href: "/profile" },
	{
		label: "Invoice",
		icon: Receipt,
		initiallyOpened: true,
		links: [{ label: "Overview", link: "/invoice" }],
	},
	{
		label: "Script Tools",
		icon: FileText,

		links: [{ label: "Editor", link: "/editor" }],
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
