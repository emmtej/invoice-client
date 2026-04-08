import { Breadcrumbs, Text, UnstyledButton } from "@mantine/core";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbNavProps {
	breadcrumb: { id: string; name: string }[];
	onNavigate: (folderId: string | null) => void;
}

export function BreadcrumbNav({ breadcrumb, onNavigate }: BreadcrumbNavProps) {
	return (
		<Breadcrumbs
			separator={
				<ChevronRight
					size={14}
					strokeWidth={2.5}
					className="text-gray-300"
				/>
			}
			separatorMargin="xs"
		>
			<UnstyledButton
				onClick={() => onNavigate(null)}
				c="gray.5"
				style={{
					display: "flex",
					alignItems: "center",
					"&:hover": { color: "var(--mantine-color-gray-8)" },
				}}
			>
				<Home size={16} />
			</UnstyledButton>
			{breadcrumb.map((segment, index) => {
				const isLast = index === breadcrumb.length - 1;
				return isLast ? (
					<Text key={segment.id} size="sm" fw={700} c="gray.8">
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
							c="gray.5"
							style={{
								"&:hover": { color: "var(--mantine-color-gray-8)" },
							}}
						>
							{segment.name}
						</Text>
					</UnstyledButton>
				);
			})}
		</Breadcrumbs>
	);
}
