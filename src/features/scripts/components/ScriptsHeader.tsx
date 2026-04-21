import { Alert, Box, Breadcrumbs, Text } from "@mantine/core";
import { AlertCircle, ChevronRight } from "lucide-react";
import { PageTitle } from "@/components/ui/text/PageTitle";

interface ScriptsHeaderProps {
	uploadErrors: string[];
	onResetUpload: () => void;
}

export function ScriptsHeader({
	uploadErrors,
	onResetUpload,
}: ScriptsHeaderProps) {
	return (
		<>
			{/* Breadcrumb orientation bar */}
			<Box
				px="md"
				py="xs"
				style={{
					borderBottom: "1px solid rgba(0,0,0,0.05)",
				}}
			>
				<Breadcrumbs
					separator={
						<ChevronRight
							size={14}
							strokeWidth={2.5}
							className="text-black/10"
						/>
					}
					separatorMargin="md"
				>
					<Text size="xs" fw={800} tt="uppercase" lts={1.5} c="dimmed">
						Script Tools
					</Text>
					<Text size="xs" fw={900} tt="uppercase" lts={1.5} c="charcoal">
						Scripts
					</Text>
				</Breadcrumbs>
			</Box>

			{/* Page header */}
			<Box px="md" pt="md">
				<PageTitle>Scripts</PageTitle>
				{uploadErrors.length > 0 && (
					<Alert
						color="on-air-red"
						icon={<AlertCircle size={16} />}
						mt="sm"
						withCloseButton
						onClose={onResetUpload}
					>
						{uploadErrors.map((err) => (
							<Text key={err} size="sm">
								{err}
							</Text>
						))}
					</Alert>
				)}
			</Box>
		</>
	);
}
