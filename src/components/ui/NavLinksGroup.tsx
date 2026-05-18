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

const linkBase =
	"block w-full py-2.5 px-3 text-sm font-medium transition-all rounded-none relative overflow-hidden group";
const linkActive = "text-blue-8 bg-blue-0 font-semibold";
const linkInactive = "hover:bg-gray-0 active:scale-[0.98]";

const childLinkBase =
	"block w-full py-2 px-4 ml-6 text-sm transition-all rounded-none";
const childLinkActive = "text-blue-7 font-semibold bg-blue-0";
const childLinkInactive = "hover:bg-gray-0 active:scale-[0.97]";

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
				className={`${childLinkBase} ${isActive ? childLinkActive : childLinkInactive}`}
			>
				{link.label}
			</UnstyledButton>
		);
	});

	const content = (
		<Group justify="space-between" gap="xs">
			<Flex align="center">
				<ThemeIcon variant="light" size={32} color="blue" className="rounded-none">
					<Icon size={18} />
				</ThemeIcon>
				<Box ml="md" className="tracking-tight">
					{label}
				</Box>
			</Flex>
			{hasLinks && (
				<ChevronRight
					strokeWidth={1.5}
					size={16}
					className={`transition-transform duration-300 ${opened ? "rotate-90" : ""}`}
				/>
			)}
		</Group>
	);

	const controlClasses = `${linkBase} ${isHrefActive ? linkActive : linkInactive}`;

	return (
		<Box mb={4}>
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
			{hasLinks ? (
				<Collapse in={opened}>
					<div className="pt-1">{items}</div>
				</Collapse>
			) : null}
		</Box>
	);
}
