import { Box, Text } from "@mantine/core";

export const ErrorMessage = ({ message }: { message?: string }) => (
	<Box display={"block"} className="h-8 block mt-2">
		{message ? (
			<Text size="xs" inherit>
				{message}
			</Text>
		) : (
			<>&nbsp;</>
		)}
	</Box>
);
