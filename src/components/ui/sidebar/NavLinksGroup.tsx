import {
  Anchor,
  Box,
  Collapse,
  Flex,
  Group,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { Link, useLocation } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import classes from "./NavLinksGroup.module.css";
import { ChevronRight, type LucideIcon } from "lucide-react";

function normalizePath(path: string) {
  return path.replace(/\/$/, "") || "/";
}

/** Picks the most specific nav link: e.g. /invoice/create wins over /invoice. */
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
    () => ({ transform: opened ? "rotate(-90deg)" : "none" }),
    [opened],
  );

  const activePath = useMemo(
    () => (hasLinks && links ? getActiveLinkPath(pathname, links) : null),
    [hasLinks, links, pathname],
  );

  const items = (hasLinks ? links : []).map((link) => {
    const isActive = activePath === normalizePath(link.link);
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
      <UnstyledButton onClick={handleToggle} className={classes.control}>
        <Group justify="space-between" gap="xs">
          <Flex align="center">
            <ThemeIcon variant="light" size={30} color="studio">
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Flex>

          {hasLinks && (
            <ChevronRight
              className={classes.chevron}
              strokeWidth={1.5}
              size={16}
              style={chevronStyle}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
