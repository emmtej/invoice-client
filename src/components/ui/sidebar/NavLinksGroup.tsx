import {
	Anchor,
	Box,
	Collapse,
	Flex,
	Group,
	ThemeIcon,
	UnstyledButton,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import classes from "./NavLinksGroup.module.css";

interface LinksGroupProps {
	icon: React.FC<any>;
	label: string;
	initiallyOpened?: boolean;
	links?: { label: string; link: string }[];
}

export function LinksGroup({
	icon: Icon,
	label,
	initiallyOpened,
	links,
}: LinksGroupProps) {
	const hasLinks = Array.isArray(links);
	const [opened, setOpened] = useState(initiallyOpened || false);
	const { pathname } = useLocation();

	const items = (hasLinks ? links : []).map((link) => {
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
		<>
			<UnstyledButton
				onClick={() => hasLinks && setOpened((o) => !o)}
				className={classes.control}
			>
				<Group justify="space-between" gap="xs">
					<Flex align="center">
						<ThemeIcon variant="light" size={30} color="violet">
							<Icon size={18} />
						</ThemeIcon>
						<Box ml="md">{label}</Box>
					</Flex>

					{hasLinks && (
						<IconChevronRight
							className={classes.chevron}
							stroke={1.5}
							size={16}
							style={{ transform: opened ? "rotate(-90deg)" : "none" }}
						/>
					)}
				</Group>
			</UnstyledButton>
			{hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
		</>
	);
}
