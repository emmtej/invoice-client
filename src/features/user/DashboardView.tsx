import {
	Box,
	Button,
	Group,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
	Activity,
	ArrowRight,
	FileText,
	Plus,
	Receipt,
} from "lucide-react";
import { scriptRepository } from "@/features/storage/scriptRepository";
import { boothRepository } from "@/features/storage/boothRepository";
import { BentoCard } from "@/components/ui/BentoCard";

export default function DashboardView() {
	const { data: recentScripts = [] } = useQuery({
		queryKey: ["recent-scripts"],
		queryFn: () => scriptRepository.getRecentScripts(3),
	});

	const { data: sessions = [] } = useQuery({
		queryKey: ["booth-sessions"],
		queryFn: () => boothRepository.getAllSessions(),
	});

	const totalRecordedTime = sessions.reduce((acc, s) => acc + s.elapsedMs, 0);
	const hours = Math.floor(totalRecordedTime / 3600000);
	const minutes = Math.floor((totalRecordedTime % 3600000) / 60000);

	return (
		<Box className="min-h-[100dvh] pb-12">
			<Box mb={48}>
				<Text className="text-5xl md:text-7xl font-sans font-semibold tracking-tighter leading-none">
					Welcome back.
				</Text>
				<Text className="text-lg md:text-xl mt-6 max-w-[65ch] leading-relaxed" c="dimmed">
					Your workspace is ready. Jump back into your latest scripts or
					generate your next invoice with precision.
				</Text>
			</Box>

			<Box className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
				<BentoCard className="md:col-span-8 md:row-span-2">
					<Stack justify="space-between" h="100%">
						<Box>
							<ThemeIcon variant="light" color="gray" size={48}>
								<Receipt size={24} strokeWidth={1.5} />
							</ThemeIcon>

							<Text className="text-3xl font-sans font-semibold mt-8 tracking-tight">
								Create New Invoice
							</Text>
							<Text c="dimmed" className="mt-4 max-w-[40ch]">
								Instantly pull word counts and line items from your script library
								to generate professional, accurate invoices.
							</Text>
						</Box>

						<Button
							component={Link}
							to="/invoice"
							size="lg"
							rightSection={<ArrowRight size={18} strokeWidth={1.5} />}
						>
							Get Started
						</Button>
					</Stack>
				</BentoCard>

				<BentoCard className="md:col-span-4 md:row-span-1">
					<Stack gap="xs">
						<Group justify="space-between">
							<Text className="text-xs font-mono uppercase tracking-widest" c="dimmed">
								Recording Stats
							</Text>
							<Activity size={14} />
						</Group>

						<Group align="baseline" gap={4} mt="sm">
							<Text className="text-4xl font-sans font-bold tracking-tight">
								{hours}h {minutes}m
							</Text>
						</Group>
						<Text size="xs" c="dimmed">
							Total time in the booth
						</Text>
					</Stack>
				</BentoCard>

				<BentoCard className="md:col-span-4 md:row-span-1">
					<Stack gap="xs" h="100%" justify="center">
						<Group gap="sm">
							<span className="h-2 w-2 rounded-full bg-green-6" aria-hidden />
							<Text size="sm" fw={600}>
								System Status: Active
							</Text>
						</Group>
						<Text size="xs" c="dimmed" mt={2}>
							All local databases are running smoothly.
						</Text>
					</Stack>
				</BentoCard>

				<BentoCard className="md:col-span-6 md:row-span-2">
					<Stack gap="xl">
						<Group justify="space-between">
							<Stack gap={0}>
								<Text className="text-xl font-sans font-semibold tracking-tight">
									Recent Scripts
								</Text>
								<Text size="xs" c="dimmed" tt="uppercase" mt={1}>
									Recently opened
								</Text>
							</Stack>
							<Button
								variant="subtle"
								color="gray"
								size="compact-xs"
								component={Link}
								to="/scripts"
							>
								View All
							</Button>
						</Group>

						<Stack gap="md">
							{recentScripts.length > 0 ? (
								recentScripts.map((script) => (
									<Group
										key={script.id}
										justify="space-between"
										className="rounded-2xl border p-4"
									>
										<Group gap="md">
											<ThemeIcon variant="light" color="blue">
												<FileText size={16} />
											</ThemeIcon>
											<Stack gap={0}>
												<Text size="sm" fw={600} truncate maw={180}>
													{script.name}
												</Text>
												<Text size="xs" c="dimmed">
													{script.wordCount.toLocaleString()} words
												</Text>
											</Stack>
										</Group>
										<ArrowRight size={14} strokeWidth={1.5} />
									</Group>
								))
							) : (
								<Stack align="center" py="xl" gap="xs" c="dimmed">
									<FileText size={32} strokeWidth={1} />
									<Text size="xs">No recent scripts</Text>
								</Stack>
							)}
						</Stack>
					</Stack>
				</BentoCard>

				<BentoCard className="md:col-span-6 md:row-span-2 border-dashed">
					<Stack h="100%" justify="center" align="center" gap="lg" ta="center">
						<Box className="rounded-3xl border p-4">
							<Plus size={32} strokeWidth={1.5} />
						</Box>
						<Stack gap={4}>
							<Text className="text-lg font-sans font-semibold tracking-tight">
								New Recording Session
							</Text>
							<Text size="sm" c="dimmed" maw={280}>
								Start a fresh session in the booth and track your progress in
								real-time.
							</Text>
						</Stack>
						<Button variant="outline" color="gray" component={Link} to="/booth">
							Launch Booth
						</Button>
					</Stack>
				</BentoCard>
			</Box>
		</Box>
	);
}
