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
					<ChevronRight
						size={14}
						strokeWidth={2.5}
						className="text-brand-dark-200"
					/>
				}
				separatorMargin="sm"
			>
				<UnstyledButton
					onClick={() => onNavigate(null)}
					aria-label="All scripts"
					className="flex items-center text-brand-dark-500 hover:text-brand-dark-700 transition-colors"
				>
					<Home size={16} />
				</UnstyledButton>
				{breadcrumb.map((segment, index) => {
					const isLast = index === breadcrumb.length - 1;
					return isLast ? (
						<Text key={segment.id} size="sm" fw={700} c="brand-dark.7">
							{segment.name}
						</Text>
					) : (
						<UnstyledButton
							key={segment.id}
							onClick={() => onNavigate(segment.id)}
							className="text-brand-dark-500 hover:text-brand-dark-700 transition-colors"
						>
							<Text size="sm" fw={500}>
								{segment.name}
							</Text>
						</UnstyledButton>
					);
				})}
			</Breadcrumbs>
		</Box>
	);
}
