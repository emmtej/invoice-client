import { Box, Breadcrumbs, Stack, Text } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import { PageTitle } from "@/components/ui/text/PageTitle";
import Scripts from "./components/Scripts";

export default function EditorView() {
	return (
		<Box h="100%" className="flex flex-col">
			<Stack gap={4} px="md" py="lg">
				<Breadcrumbs
					separator={
						<ChevronRight
							size={14}
							strokeWidth={2.5}
							className="text-sage-200"
						/>
					}
					separatorMargin="md"
				>
					<Text size="xs" fw={700} tt="uppercase" lts={1.5} c="brand-dark.5">
						Script Tools
					</Text>
					<Text
						size="xs"
						fw={800}
						tt="uppercase"
						lts={1.5}
						c="forest.9"
						style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
					>
						Editor
					</Text>
				</Breadcrumbs>
				<PageTitle>
					Script <span style={{ fontStyle: "italic" }}>Editor</span>
				</PageTitle>
			</Stack>

			<Box flex={1} mih={0}>
				<Scripts />
			</Box>
		</Box>
	);
}
