import { Box, Text } from "@mantine/core";

export const ErrorMessage = ({ message }: { message?: string }) => (
	<Box display="block" mt="xs" style={{ minHeight: "1.25rem" }}>
		{message ? (
			<Text size="xs" c="red">
				{message}
			</Text>
		) : (
			<>&nbsp;</>
		)}
	</Box>
);
