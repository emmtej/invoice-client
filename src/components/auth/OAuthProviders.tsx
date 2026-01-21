import { Button, Stack } from "@mantine/core";
import {
	IconBrandAppleFilled,
	IconBrandGoogleFilled,
} from "@tabler/icons-react";

export function OAuthProviders() {
	return (
		<Stack>
			<Button
				leftSection={<IconBrandGoogleFilled size={14} />}
				variant="default"
				fullWidth
			>
				Google
			</Button>
			<Button
				leftSection={<IconBrandAppleFilled size={14} />}
				variant="default"
				fullWidth
			>
				Apple
			</Button>
		</Stack>
	);
}
