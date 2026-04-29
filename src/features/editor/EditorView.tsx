import { Box, Breadcrumbs, Stack, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Scripts from "./components/Scripts";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
		},
	},
};

export default function EditorView() {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			style={{ height: "100%", display: "flex", flexDirection: "column" }}
		>
			{/* Breadcrumb Orientation */}
			<motion.div variants={itemVariants}>
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
						<Text size="xs" fw={700} tt="uppercase" lts={1.5} c="sage.4">
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
					<Text
						component="h1"
						size="xl"
						fw={600}
						c="forest.9"
						style={{ fontFamily: "var(--font-display)", fontSize: "32px" }}
					>
						Script <span style={{ fontStyle: "italic" }}>Editor</span>
					</Text>
				</Stack>
			</motion.div>

			{/* Main Editor Content */}
			<Box flex={1} mih={0}>
				<Scripts />
			</Box>
		</motion.div>
	);
}
