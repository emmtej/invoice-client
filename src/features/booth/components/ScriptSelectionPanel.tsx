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
import { AlertCircle, CheckCircle2, FileText, Hash, Type } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { useBoothSettingsStore } from "../store/useBoothSettingsStore";
import { useBoothStore } from "../store/useBoothStore";
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

	const { wordCountPricing, setWordCountPricing } = useBoothSettingsStore(
		useShallow((s) => ({
			wordCountPricing: s.wordCountPricing,
			setWordCountPricing: s.setWordCountPricing,
		})),
	);

	const invalidCount = script?.overview.invalidLines.length ?? 0;
	const billableLines =
		(script?.overview.validLines.length ?? 0) +
		(script?.overview.actionLines.length ?? 0);

	const totalWords = script?.overview.wordCount ?? 0;
	const estimatedValue = totalWords * wordCountPricing;

	return (
		<Stack gap="lg">
			<Group justify="space-between" align="center">
				<Text fw={700} size="sm" c="gray.7" tt="uppercase" lts={0.5}>
					{status === "selecting" ? "Selected Script" : "Start New Session"}
				</Text>
				{status === "selecting" && (
					<Button
						variant="subtle"
						color="gray"
						size="xs"
						onClick={resetSession}
						fw={700}
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
				<Stack gap="xl">
					<SurfaceCard
						p={0}
						style={{
							border: "1px solid var(--mantine-color-gray-1)",
							backgroundColor: "white",
						}}
						className="shadow-md"
					>
						<Stack gap={0}>
							<Box p="xl" bg="gray.0">
								<Group wrap="nowrap" align="center" gap="xl">
									<ThemeIcon
										size={56}
										radius="lg"
										variant="filled"
										color="studio"
									>
										<FileText size={30} />
									</ThemeIcon>
									<Box flex={1}>
										<Text fw={800} size="24px" c="gray.9" lh={1.1} lts={-0.5}>
											{script.name}
										</Text>
										<Text size="sm" c="gray.7" mt={6} fw={500}>
											Imported on{" "}
											{new Date(script.createdAt).toLocaleDateString()}
										</Text>
									</Box>
									<Button
										color="wave"
										size="lg"
										radius="md"
										onClick={() => useBoothStore.getState().startSession()}
										className="shadow-md px-10"
										fw={800}
									>
										Start Session
									</Button>
								</Group>
							</Box>

							<Box p="xl" pt="md">
								<Stack gap={32}>
									<Group align="flex-end" gap={48}>
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
											w={140}
											size="md"
											fw={700}
										/>
										<Box>
											<Text
												size="xs"
												c="gray.7"
												fw={700}
												tt="uppercase"
												lts={1}
												mb={8}
											>
												Estimated Value
											</Text>
											<Text fw={800} size="28px" c="wave.7" lts={-0.5}>
												$
												{estimatedValue.toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												})}
											</Text>
										</Box>
									</Group>

									<Divider color="gray.1" />

									<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={32}>
										<Group gap="md">
											<ThemeIcon
												variant="light"
												color="gray"
												size="lg"
												radius="md"
											>
												<Type size={20} />
											</ThemeIcon>
											<Box>
												<Text
													size="xs"
													c="gray.7"
													fw={700}
													tt="uppercase"
													lts={1}
												>
													Word Count
												</Text>
												<Text fw={800} size="xl" c="gray.9">
													{totalWords.toLocaleString()}
												</Text>
											</Box>
										</Group>

										<Group gap="md">
											<ThemeIcon
												variant="light"
												color="gray"
												size="lg"
												radius="md"
											>
												<Hash size={20} />
											</ThemeIcon>
											<Box>
												<Text
													size="xs"
													c="gray.7"
													fw={700}
													tt="uppercase"
													lts={1}
												>
													Billable Lines
												</Text>
												<Text fw={800} size="xl" c="gray.9">
													{billableLines.toLocaleString()}
												</Text>
											</Box>
										</Group>

										<Group gap="md">
											<ThemeIcon
												variant="light"
												color={invalidCount > 0 ? "orange" : "teal"}
												size="lg"
												radius="md"
											>
												{invalidCount > 0 ? (
													<AlertCircle size={20} />
												) : (
													<CheckCircle2 size={20} />
												)}
											</ThemeIcon>
											<Box>
												<Text
													size="xs"
													c="gray.7"
													fw={700}
													tt="uppercase"
													lts={1}
												>
													Script Health
												</Text>
												<Text
													fw={800}
													size="xl"
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
										icon={<AlertCircle size={18} />}
										color="orange"
										variant="light"
										title="Parsing Issues Detected"
										radius="md"
										styles={{
											title: { fontWeight: 800 },
										}}
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
