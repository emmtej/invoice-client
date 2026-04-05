import {
	Box,
	Collapse,
	Flex,
	Group,
	ThemeIcon,
	UnstyledButton,
} from "@mantine/core";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

function normalizePath(path: string) {
	return path.replace(/\/$/, "") || "/";
}

function getActiveLinkPath(
	pathname: string,
	links: { link: string }[],
): string | null {
	const normalized = normalizePath(pathname);
	let best: string | null = null;
	let bestLen = -1;

	for (const l of links) {
		const p = normalizePath(l.link);
		const matches = normalized === p || normalized.startsWith(`${p}/`);
		if (matches && p.length > bestLen) {
			best = p;
			bestLen = p.length;
		}
	}
	return best;
}

const controlStyles = {
	root: {
		fontWeight: 500,
		display: "block",
		width: "100%",
		padding: "var(--mantine-spacing-sm) var(--mantine-spacing-md)",
		color: "var(--mantine-color-text)",
		fontSize: "var(--mantine-font-size-sm)",
		"&:hover": {
			backgroundColor: "var(--mantine-color-primary-0)",
			color: "var(--mantine-color-primary-7)",
		},
	},
} as const;

const linkBaseStyles = {
	fontWeight: 500,
	display: "block",
	textDecoration: "none",
	padding: "var(--mantine-spacing-sm) var(--mantine-spacing-md)",
	paddingLeft: "var(--mantine-spacing-lg)",
	marginLeft: "var(--mantine-spacing-xl)",
	fontSize: "var(--mantine-font-size-sm)",
	color: "var(--mantine-color-gray-7)",
	borderLeft: "1px solid var(--mantine-color-gray-3)",
	"&:hover": {
		backgroundColor: "var(--mantine-color-primary-0)",
		color: "var(--mantine-color-primary-7)",
	},
} as const;

const linkActiveStyles = {
	...linkBaseStyles,
	borderLeftColor: "var(--mantine-color-primary-5)",
	color: "var(--mantine-color-primary-6)",
	backgroundColor: "var(--mantine-color-primary-0)",
} as const;

interface LinksGroupProps {
	icon: LucideIcon;
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

	const handleToggle = useCallback(() => {
		if (hasLinks) setOpened((o) => !o);
	}, [hasLinks]);

	const chevronStyle = useMemo(
		() => ({
			transform: opened ? "rotate(-90deg)" : "none",
			transition: "transform 200ms ease",
		}),
		[opened],
	);

	const activePath = useMemo(
		() => (hasLinks && links ? getActiveLinkPath(pathname, links) : null),
		[hasLinks, links, pathname],
	);

	const items = (hasLinks ? links : []).map((link) => {
		const isActive = activePath === normalizePath(link.link);
		return (
			<UnstyledButton
				key={link.label}
				component={Link}
				to={link.link}
				style={isActive ? linkActiveStyles : linkBaseStyles}
			>
				{link.label}
			</UnstyledButton>
		);
	});

	return (
		<>
			<UnstyledButton onClick={handleToggle} styles={controlStyles}>
				<Group justify="space-between" gap="xs">
					<Flex align="center">
						<ThemeIcon variant="light" size={30} color="studio">
							<Icon size={18} />
						</ThemeIcon>
						<Box ml="md">{label}</Box>
					</Flex>

					{hasLinks && (
						<ChevronRight strokeWidth={1.5} size={16} style={chevronStyle} />
					)}
				</Group>
			</UnstyledButton>
			{hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
		</>
	);
}
