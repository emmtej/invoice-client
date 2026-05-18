import {
	Anchor,
	Avatar,
	Group,
	Text,
	Title,
	UnstyledButton,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useUserStore } from "@/features/user/userStore";
import { LinkButton } from "./AppButtonLink";
import { APP_SHELL_HEADER_HEIGHT } from "./layout-constants";

export function Navbar() {
	const user = useUserStore((store) => store.user);

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
				<Title order={3} className="flex items-baseline leading-none">
					<span className="font-black tracking-tighter">In</span>
					<span className="italic font-black text-[1.4em] -mx-[0.04em] relative top-[0.02em] z-[1]">
						V
					</span>
					<span className="font-normal tracking-widest text-[0.85em] font-sans">
						oice
					</span>
				</Title>
			</UnstyledButton>

			{user === null ? (
				<Group gap="sm">
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
						<Avatar radius={0} />
						<Text size="sm" fw={500}>
							{user.firstname} {user.lastname}
						</Text>
					</Group>
				</Anchor>
			)}
		</Group>
	);
}
