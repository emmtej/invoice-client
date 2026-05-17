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
				className={`block w-full py-2 px-4 ml-8 text-sm transition-colors border-l border-transparent ${
					isActive
						? "text-wave-700 font-semibold bg-wave-50 border-wave-500"
						: "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
				}`}
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
				<ChevronRight
					strokeWidth={1.5}
					size={16}
					className={`transition-transform duration-200 ${opened ? "rotate-90" : ""}`}
				/>
			)}
		</Group>
	);

	const controlClasses = `block w-full py-2 px-3 text-sm font-semibold transition-colors rounded-md ${
		isHrefActive
			? "text-wave-800 bg-wave-50"
			: "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
	}`;

	return (
		<>
			{isDirectLink ? (
				<UnstyledButton
					component={Link}
					to={href || ""}
					onClick={onNavigate}
					onMouseEnter={() => initDb()}
					className={controlClasses}
				>
					{content}
				</UnstyledButton>
			) : (
				<UnstyledButton onClick={handleToggle} className={controlClasses}>
					{content}
				</UnstyledButton>
			)}
			{hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
		</>
	);
}
