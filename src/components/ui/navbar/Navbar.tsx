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
				className={`rounded-md transition-colors duration-200 ${
					isActive
						? "text-wave-800 bg-wave-50"
						: "text-brand-dark-500 hover:bg-brand-dark-50 hover:text-brand-dark-700"
				}`}
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
				className="flex items-center no-underline text-inherit"
			>
				<Title
					order={3}
					c="forest.9"
					className="flex items-baseline leading-none"
				>
					<span className="font-black tracking-tighter">In</span>
					<span
						className="italic font-black text-wave-800 text-[1.4em] -mx-[0.04em] relative top-[0.02em] z-[1]"
					>
						V
					</span>
					<span className="font-normal tracking-widest text-brand-dark-400 text-[0.85em] font-sans">
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
