import { Box, Breadcrumbs, Text, UnstyledButton } from "@mantine/core";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbNavProps {
	breadcrumb: { id: string; name: string }[];
	onNavigate: (folderId: string | null) => void;
}

export function BreadcrumbNav({ breadcrumb, onNavigate }: BreadcrumbNavProps) {
	return (
		<Box component="nav" aria-label="Folder path" pt="sm" pb="xs">
			<Breadcrumbs
				separator={
					<ChevronRight size={14} strokeWidth={2.5} className="text-black/10" />
				}
				separatorMargin="sm"
			>
				<UnstyledButton
					onClick={() => onNavigate(null)}
					c="dimmed"
					style={{
						display: "flex",
						alignItems: "center",
						"&:hover": { color: "var(--mantine-color-charcoal-light)" },
					}}
				>
					<Home size={16} />
				</UnstyledButton>
				{breadcrumb.map((segment, index) => {
					const isLast = index === breadcrumb.length - 1;
					return isLast ? (
						<Text key={segment.id} size="sm" fw={700} c="charcoal">
							{segment.name}
						</Text>
					) : (
						<UnstyledButton
							key={segment.id}
							onClick={() => onNavigate(segment.id)}
						>
							<Text
								size="sm"
								fw={500}
								c="dimmed"
								style={{
									"&:hover": { color: "var(--mantine-color-charcoal-light)" },
								}}
							>
								{segment.name}
							</Text>
						</UnstyledButton>
					);
				})}
			</Breadcrumbs>
		</Box>
	);
}
