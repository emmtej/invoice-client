import { Alert, Box, Breadcrumbs, Text } from "@mantine/core";
import { AlertCircle, ChevronRight } from "lucide-react";
import { SCRIPT_LIBRARY_LIST_MAX_WIDTH } from "@/components/ui/layout/layout-constants";
import { PageTitle } from "@/components/ui/text/PageTitle";

interface ScriptsHeaderProps {
	uploadErrors: string[];
	onResetUpload: () => void;
}

export function ScriptsHeader({
	uploadErrors,
	onResetUpload,
}: ScriptsHeaderProps) {
	const listColumnProps = {
		maw: SCRIPT_LIBRARY_LIST_MAX_WIDTH,
		mx: "auto" as const,
		w: "100%" as const,
	};

	return (
		<>
			{/* Breadcrumb orientation bar */}
			<Box
				px="md"
				py="xs"
				{...listColumnProps}
				style={(theme) => ({
					borderBottom: `1px solid ${theme.colors.gray[1]}`,
				})}
			>
				<Breadcrumbs
					separator={
						<ChevronRight
							size={14}
							strokeWidth={2.5}
							className="text-gray-300"
						/>
					}
					separatorMargin="md"
				>
					<Text size="xs" fw={800} tt="uppercase" lts={1.5} c="gray.5">
						Script Tools
					</Text>
					<Text size="xs" fw={900} tt="uppercase" lts={1.5} c="gray.8">
						Scripts
					</Text>
				</Breadcrumbs>
			</Box>

			{/* Page header */}
			<Box px="md" pt="md" {...listColumnProps}>
				<PageTitle>Scripts</PageTitle>
				{uploadErrors.length > 0 && (
					<Alert
						color="red"
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
