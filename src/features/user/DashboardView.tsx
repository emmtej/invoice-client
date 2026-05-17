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
	Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scriptRepository } from "@/features/storage/repository/scriptRepository";
import { boothRepository } from "@/features/storage/repository/boothRepository";
import { BentoCard } from "@/components/ui/card/BentoCard";
import React from "react";

/** 
 * Isolated component for the "Live Status" breathing effect to prevent parent re-renders 
 */
const LiveStatusIndicator = React.memo(() => (
	<motion.div
		animate={{
			scale: [1, 1.2, 1],
			opacity: [0.5, 1, 0.5],
		}}
		transition={{
			duration: 2,
			repeat: Infinity,
			ease: "easeInOut",
		}}
		className="w-2 h-2 rounded-full bg-wave-5 shadow-[0_0_8px_rgba(0,173,173,0.5)]"
	/>
));
LiveStatusIndicator.displayName = "LiveStatusIndicator";

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
			{/* Hero Section */}
			<Box mb={48}>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				>
					<Text 
						className="text-5xl md:text-7xl font-sans font-semibold tracking-tighter leading-none"
						c="forest.9"
					>
						Welcome back.
					</Text>
					<Text 
						className="text-lg md:text-xl text-brand-dark-4 mt-6 max-w-[65ch] leading-relaxed"
					>
						Your workspace is ready. Jump back into your latest scripts or 
						generate your next invoice with precision.
					</Text>
				</motion.div>
			</Box>

			{/* Bento Grid */}
			<Box className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
				
				{/* Main Action Card - Spans 8 cols */}
				<BentoCard 
					index={1} 
					className="md:col-span-8 md:row-span-2 bg-forest-9 group relative"
				>
					<Stack justify="space-between" h="100%">
						<Box>
							<Group justify="space-between" align="flex-start">
								<ThemeIcon variant="light" color="sage.0" size={48} radius="xl">
									<Receipt size={24} strokeWidth={1.5} className="text-forest-9" />
								</ThemeIcon>
								<motion.div
									animate={{ rotate: [0, 10, 0] }}
									transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
								>
									<Sparkles size={20} className="text-sage-3 opacity-40" />
								</motion.div>
							</Group>
							
							<Text className="text-3xl font-sans font-semibold mt-8 text-white tracking-tight">
								Create New Invoice
							</Text>
							<Text className="text-sage-1/70 mt-4 max-w-[40ch]">
								Instantly pull word counts and line items from your script library 
								to generate professional, accurate invoices.
							</Text>
						</Box>

						<Group>
							<Button
								component={Link}
								to="/invoice"
								size="lg"
								radius="xl"
								color="sage.4"
								className="bg-sage-4 hover:bg-sage-3 text-forest-9 transition-all hover:translate-x-1"
								rightSection={<ArrowRight size={18} />}
							>
								Get Started
							</Button>
						</Group>
					</Stack>

					{/* Decorative element */}
					<Box className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-sage-4/10 rounded-full blur-3xl pointer-events-none" />
				</BentoCard>

				{/* Quick Stats - Spans 4 cols */}
				<BentoCard index={2} className="md:col-span-4 md:row-span-1">
					<Stack gap="xs">
						<Group justify="space-between">
							<Text className="text-xs font-mono uppercase tracking-widest text-brand-dark-4">
								Recording Stats
							</Text>
							<Activity size={14} className="text-wave-5" />
						</Group>
						
						<Group align="baseline" gap={4} mt="sm">
							<Text className="text-4xl font-sans font-bold tracking-tight">
								{hours}h {minutes}m
							</Text>
						</Group>
						<Text className="text-xs text-brand-dark-3">
							Total time in the booth
						</Text>
					</Stack>
				</BentoCard>

				{/* Live Status Card - Spans 4 cols */}
				<BentoCard index={3} className="md:col-span-4 md:row-span-1 border-wave-2/30">
					<Stack gap="xs" h="100%" justify="center">
						<Group gap="sm">
							<LiveStatusIndicator />
							<Text className="text-sm font-semibold text-brand-dark-7">
								System Status: Active
							</Text>
						</Group>
						<Text className="text-xs text-brand-dark-4 mt-2">
							All local databases and cloud syncs are running smoothly.
						</Text>
					</Stack>
				</BentoCard>

				{/* Recent Scripts - Spans 6 cols */}
				<BentoCard index={4} className="md:col-span-6 md:row-span-2">
					<Stack gap="xl">
						<Group justify="space-between">
							<Stack gap={0}>
								<Text className="text-xl font-sans font-semibold tracking-tight">
									Recent Scripts
								</Text>
								<Text className="text-xs text-brand-dark-3 uppercase tracking-tighter mt-1">
									Intelligent Sorting
								</Text>
							</Stack>
							<Button 
								variant="subtle" 
								color="brand-dark" 
								size="compact-xs" 
								radius="xl"
								component={Link}
								to="/dashboard" // Adjust as needed
							>
								View All
							</Button>
						</Group>

						<Stack gap="md">
							<AnimatePresence mode="popLayout">
								{recentScripts.length > 0 ? (
									recentScripts.map((script, i) => (
										<motion.div
											key={script.id}
											layoutId={script.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.1 * i }}
											className="group cursor-pointer"
										>
											<Group justify="space-between" className="p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
												<Group gap="md">
													<ThemeIcon variant="light" color="forest.0" radius="md">
														<FileText size={16} className="text-forest-9" />
													</ThemeIcon>
													<Stack gap={0}>
														<Text className="text-sm font-semibold truncate max-w-[180px]">
															{script.name}
														</Text>
														<Text className="text-[10px] text-brand-dark-4 font-mono">
															{script.wordCount.toLocaleString()} WORDS
														</Text>
													</Stack>
												</Group>
												<ArrowRight size={14} className="text-slate-300 group-hover:text-forest-9 group-hover:translate-x-1 transition-all" />
											</Group>
										</motion.div>
									))
								) : (
									<Stack align="center" py="xl" gap="xs" className="opacity-40">
										<FileText size={32} strokeWidth={1} />
										<Text className="text-xs font-sans">No recent scripts</Text>
									</Stack>
								)}
							</AnimatePresence>
						</Stack>
					</Stack>
				</BentoCard>

				{/* New Features Card - Spans 6 cols */}
				<BentoCard index={5} className="md:col-span-6 md:row-span-2 bg-slate-50 border-dashed border-slate-300">
					<Stack h="100%" justify="center" align="center" gap="lg" className="text-center">
						<Box className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
							<Plus size={32} className="text-slate-300" />
						</Box>
						<Stack gap={4}>
							<Text className="text-lg font-sans font-semibold tracking-tight text-brand-dark-7">
								New Recording Session
							</Text>
							<Text className="text-sm text-brand-dark-4 max-w-[30ch]">
								Start a fresh session in the booth and track your progress in real-time.
							</Text>
						</Stack>
						<Button
							variant="outline"
							color="brand-dark"
							radius="xl"
							className="border-slate-300 text-brand-dark-6 hover:bg-white"
						>
							Launch Booth
						</Button>
					</Stack>
				</BentoCard>

			</Box>
		</Box>
	);
}
