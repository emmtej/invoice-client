import {
	Alert,
	Box,
	Button,
	Divider,
	Group,
	NumberInput,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import {
	AlertCircle,
	CheckCircle2,
	FileText,
	Hash,
	Type,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { useBoothStore } from "../store/useBoothStore";
import { useBoothSettingsStore } from "../store/useBoothSettingsStore";
import { ScriptSelector } from "./ScriptSelector";

interface ScriptSelectionPanelProps {
	setIsLoadingScripts: (loading: boolean) => void;
	isInitialLoading: boolean;
}

export function ScriptSelectionPanel({
	setIsLoadingScripts,
	isInitialLoading,
}: ScriptSelectionPanelProps) {
	const { script, status, setScript, resetSession } = useBoothStore(
		useShallow((s) => ({
			script: s.script,
			status: s.status,
			setScript: s.setScript,
			resetSession: s.resetSession,
		})),
	);

	const {
		wordCountPricing,
		setWordCountPricing,
	} = useBoothSettingsStore(
		useShallow((s) => ({
			wordCountPricing: s.wordCountPricing,
			setWordCountPricing: s.setWordCountPricing,
		}))
	);

	const invalidCount = script?.overview.invalidLines.length ?? 0;
	const billableLines =
		(script?.overview.validLines.length ?? 0) +
		(script?.overview.actionLines.length ?? 0);

	const totalWords = script?.overview.wordCount ?? 0;
	const estimatedValue = totalWords * wordCountPricing;

	return (
		<Stack gap="md">
			<Group justify="space-between" align="center">
				<Text fw={700} size="sm" c="gray.6" tt="uppercase" lts={0.5}>
					{status === "selecting" ? "Selected Script" : "Start New Session"}
				</Text>
				{status === "selecting" && (
					<Button
						variant="subtle"
						color="gray"
						size="xs"
						onClick={resetSession}
					>
						Choose another script
					</Button>
				)}
			</Group>

			{status === "idle" && (
				<ScriptSelector
					onSelect={setScript}
					onLoadingChange={setIsLoadingScripts}
					hideLoader={isInitialLoading}
				/>
			)}

			{status === "selecting" && script && (
				<Stack gap="lg">
					<SurfaceCard
						p={0}
						style={{ border: "1px solid var(--mantine-color-gray-2)" }}
					>
						<Stack gap={0}>
							<Box p="xl" bg="gray.0">
								<Group wrap="nowrap" align="center" gap="md">
									<ThemeIcon size={48} radius="md" variant="light" color="wave">
										<FileText size={26} />
									</ThemeIcon>
									<Box flex={1}>
										<Text fw={800} size="xl" c="gray.9" lh={1.2}>
											{script.name}
										</Text>
										<Text size="sm" c="gray.5" mt={2} fw={500}>
											Imported on {new Date(script.createdAt).toLocaleDateString()}
										</Text>
									</Box>
									<Button
										color="wave"
										size="md"
										radius="md"
										onClick={() => useBoothStore.getState().startSession()}
									>
										Start Session
									</Button>
								</Group>
							</Box>

							<Box p="xl" pt="md">
								<Stack gap="xl">
									<Group align="flex-end" gap="xl">
										<NumberInput
											label="Price per word"
											placeholder="0.25"
											value={wordCountPricing}
											onChange={(val) => setWordCountPricing(Number(val))}
											decimalScale={2}
											fixedDecimalScale
											prefix="$"
											min={0}
											step={0.01}
											w={120}
											size="sm"
										/>
										<Box>
											<Text
												size="xs"
												c="gray.5"
												fw={700}
												tt="uppercase"
												lts={0.5}
												mb={4}
											>
												Estimated Value
											</Text>
											<Text fw={800} size="xl" c="wave.7">
												$
												{estimatedValue.toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												})}
											</Text>
										</Box>
									</Group>

									<Divider color="gray.1" />

									<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
										<Group gap="md">
											<ThemeIcon variant="light" color="gray" size="md">
												<Type size={18} />
											</ThemeIcon>
											<Box>
												<Text
													size="xs"
													c="gray.5"
													fw={700}
													tt="uppercase"
													lts={0.5}
												>
													Word Count
												</Text>
												<Text fw={800} size="lg">
													{totalWords.toLocaleString()}
												</Text>
											</Box>
										</Group>

										<Group gap="md">
											<ThemeIcon variant="light" color="gray" size="md">
												<Hash size={18} />
											</ThemeIcon>
											<Box>
												<Text
													size="xs"
													c="gray.5"
													fw={700}
													tt="uppercase"
													lts={0.5}
												>
													Billable Lines
												</Text>
												<Text fw={800} size="lg">
													{billableLines.toLocaleString()}
												</Text>
											</Box>
										</Group>

										<Group gap="md">
											<ThemeIcon
												variant="light"
												color={invalidCount > 0 ? "orange" : "teal"}
												size="md"
											>
												{invalidCount > 0 ? (
													<AlertCircle size={18} />
												) : (
													<CheckCircle2 size={18} />
												)}
											</ThemeIcon>
											<Box>
												<Text
													size="xs"
													c="gray.5"
													fw={700}
													tt="uppercase"
													lts={0.5}
												>
													Script Health
												</Text>
												<Text
													fw={800}
													size="lg"
													c={invalidCount > 0 ? "orange.8" : "teal.8"}
												>
													{invalidCount > 0
														? `${invalidCount} issues`
														: "Perfect"}
												</Text>
											</Box>
										</Group>
									</SimpleGrid>
								</Stack>
							</Box>

							{invalidCount > 0 && (
								<Box px="xl" pb="xl">
									<Alert
										icon={<AlertCircle size={16} />}
										color="orange"
										variant="light"
										title="Parsing Issues Detected"
										radius="md"
									>
										Some lines could not be automatically identified as dialogue
										or action. You can still record, but word counts might be
										slightly off.
									</Alert>
								</Box>
							)}
						</Stack>
					</SurfaceCard>
				</Stack>
			)}
		</Stack>
	);
}
