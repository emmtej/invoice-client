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
import { initDb } from "@/features/storage/pgliteClient";

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
		fontWeight: 600,
		display: "block",
		width: "100%",
		padding: "var(--mantine-spacing-sm) var(--mantine-spacing-md)",
		color: "var(--mantine-color-gray-6)",
		fontSize: "var(--mantine-font-size-sm)",
		transition: "all 150ms ease",
		"&:hover": {
			backgroundColor: "var(--mantine-color-gray-0)",
			color: "var(--mantine-color-gray-8)",
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
	color: "var(--mantine-color-gray-5)",
	transition: "all 150ms ease",
	"&:hover": {
		backgroundColor:
			"color-mix(in srgb, var(--mantine-color-wave-8) 5%, white)",
		color: "var(--mantine-color-wave-8)",
	},
} as const;

const linkActiveStyles = {
	...linkBaseStyles,
	color: "var(--mantine-color-wave-8)",
	backgroundColor: "color-mix(in srgb, var(--mantine-color-wave-8) 8%, white)",
	fontWeight: 600,
} as const;

const controlActiveStyles = {
	root: {
		...controlStyles.root,
		color: "var(--mantine-color-wave-8)",
		backgroundColor:
			"color-mix(in srgb, var(--mantine-color-wave-8) 8%, white)",
		fontWeight: 700,
	},
} as const;

interface LinksGroupProps {
	icon: LucideIcon;
	label: string;
	initiallyOpened?: boolean;
	links?: { label: string; link: string }[];
	href?: string;
	onNavigate?: () => void;
}

export function LinksGroup({
	icon: Icon,
	label,
	initiallyOpened,
	links,
	href,
	onNavigate,
}: LinksGroupProps) {
	const hasLinks = Array.isArray(links);
	const isDirectLink = !hasLinks && !!href;
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

	const isHrefActive =
		isDirectLink &&
		href &&
		(normalizePath(pathname) === normalizePath(href) ||
			normalizePath(pathname).startsWith(`${normalizePath(href)}/`));

	const items = (hasLinks ? links : []).map((link) => {
		const isActive = activePath === normalizePath(link.link);
		return (
			<UnstyledButton
				key={link.label}
				component={Link}
				to={link.link}
				onClick={onNavigate}
				onMouseEnter={() => initDb()}
				style={isActive ? linkActiveStyles : linkBaseStyles}
			>
				{link.label}
			</UnstyledButton>
		);
	});

	const content = (
		<Group justify="space-between" gap="xs">
			<Flex align="center">
				<ThemeIcon variant="light" size={30} color="wave">
					<Icon size={18} />
				</ThemeIcon>
				<Box ml="md">{label}</Box>
			</Flex>
			{hasLinks && (
				<ChevronRight strokeWidth={1.5} size={16} style={chevronStyle} />
			)}
		</Group>
	);

	return (
		<>
			{isDirectLink ? (
				<UnstyledButton
					component={Link}
					to={href || ""}
					onClick={onNavigate}
					onMouseEnter={() => initDb()}
					styles={isHrefActive ? controlActiveStyles : controlStyles}
				>
					{content}
				</UnstyledButton>
			) : (
				<UnstyledButton onClick={handleToggle} styles={controlStyles}>
					{content}
				</UnstyledButton>
			)}
			{hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
		</>
	);
}
