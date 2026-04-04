import { Button, Stack } from "@mantine/core";
import { Apple, Chrome } from "lucide-react";

export function OAuthProviders() {
	return (
		<Stack gap="sm">
			<Button leftSection={<Chrome size={14} />} variant="default" fullWidth>
				Google
			</Button>
			<Button leftSection={<Apple size={14} />} variant="default" fullWidth>
				Apple
			</Button>
		</Stack>
	);
}
