import {
	Button,
	Checkbox,
	Divider,
	Group,
	Modal,
	NumberInput,
	SegmentedControl,
	Stack,
	Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Settings2 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useBoothSettingsStore } from "../store/useBoothSettingsStore";

export function BoothSettingsModal() {
	const [opened, { open, close }] = useDisclosure(false);

	const {
		wordCountPricing,
		setWordCountPricing,
		showCurrentEarnings,
		setShowCurrentEarnings,
		showRealizedHourly,
		setShowRealizedHourly,
		trackingMode,
		setTrackingMode,
	} = useBoothSettingsStore(
		useShallow((s) => ({
			wordCountPricing: s.wordCountPricing,
			setWordCountPricing: s.setWordCountPricing,
			showCurrentEarnings: s.showCurrentEarnings,
			setShowCurrentEarnings: s.setShowCurrentEarnings,
			showRealizedHourly: s.showRealizedHourly,
			setShowRealizedHourly: s.setShowRealizedHourly,
			trackingMode: s.trackingMode,
			setTrackingMode: s.setTrackingMode,
		})),
	);

	return (
		<>
			<Button
				variant="light"
				color="gray"
				onClick={open}
				leftSection={<Settings2 size={16} />}
				size="xs"
			>
				Booth Settings
			</Button>

			<Modal
				opened={opened}
				onClose={close}
				title={
					<Text fw={700} size="lg">
						Booth Settings
					</Text>
				}
				centered
				radius="md"
			>
				<Stack gap="lg">
					<Text size="sm" c="gray.6">
						Configure your default rate and display options for recording
						sessions.
					</Text>

					<Stack gap="md">
						<NumberInput
							label="Default Price per Word"
							description="Used to calculate estimated script value"
							placeholder="0.25"
							value={wordCountPricing}
							onChange={(val) => setWordCountPricing(Number(val))}
							decimalScale={2}
							fixedDecimalScale
							prefix="$"
							min={0}
							step={0.01}
							size="sm"
						/>

						<Divider label="Tracking Workflow" labelPosition="left" />

						<Stack gap={4}>
							<Text size="sm" fw={500}>
								Recording Mode
							</Text>
							<SegmentedControl
								value={trackingMode}
								onChange={(val) => setTrackingMode(val as "line" | "scene")}
								data={[
									{ label: "Line by Line", value: "line" },
									{ label: "Scene by Scene", value: "scene" },
								]}
								fullWidth
								color="wave"
								size="sm"
							/>
							<Text size="xs" c="gray.5" mt={4}>
								{trackingMode === "line"
									? "Check off individual lines as you record."
									: "Check off entire scenes at once."}
							</Text>
						</Stack>

						<Divider label="Visibility" labelPosition="left" />

						<Checkbox
							label="Show Current Earnings"
							description="Display estimated earnings in the session timer"
							checked={showCurrentEarnings}
							onChange={(event) =>
								setShowCurrentEarnings(event.currentTarget.checked)
							}
							color="wave"
						/>

						<Checkbox
							label="Show Realized Hourly"
							description="Display estimated hourly rate in the session timer"
							checked={showRealizedHourly}
							onChange={(event) =>
								setShowRealizedHourly(event.currentTarget.checked)
							}
							color="wave"
						/>
					</Stack>

					<Group justify="flex-end" mt="md">
						<Button variant="filled" color="wave" onClick={close}>
							Done
						</Button>
					</Group>
				</Stack>
			</Modal>
		</>
	);
}
