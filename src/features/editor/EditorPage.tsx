import { Box } from "@mantine/core";
import Scripts from "./components/Scripts";

export default function EditorPage() {
	return (
		<Box
			style={{
				flex: 1,
				minHeight: 0,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Scripts />
		</Box>
	);
}
