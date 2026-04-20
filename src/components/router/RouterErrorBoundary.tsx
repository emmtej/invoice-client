import { Center, Paper, Stack, Text } from "@mantine/core";
import React from "react";

export class RouterErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean }
> {
	state = { hasError: false };
	static getDerivedStateFromError() {
		return { hasError: true };
	}
	render() {
		if (this.state.hasError)
			return (
				<Center mih="50vh">
					<Paper withBorder p="xl" maw={420} w="100%" bg="white">
						<Stack gap="sm">
							<Text fw={800} c="gray.8">
								Something went wrong loading this page.
							</Text>
							<Text size="sm" c="gray.5">
								Refresh the page or navigate to another section and try again.
							</Text>
						</Stack>
					</Paper>
				</Center>
			);
		return this.props.children;
	}
}
