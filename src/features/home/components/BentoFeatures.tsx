"use client";

import { Box, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { 
	Mic, 
	Activity, 
	CircleDashed, 
	Receipt, 
	FileText, 
	Sparkles,
	ArrowUpRight
} from "lucide-react";
import React from "react";
import { BentoCard } from "@/components/ui/card/BentoCard";

/**
 * Isolated component for perpetual motion: The Intelligent List
 */
const ScriptList = React.memo(() => {
	const items = [
		{ id: "1", name: "S02_E04_Pickups.docx", words: 1240 },
		{ id: "2", name: "Main_Quest_V3.docx", words: 8420 },
		{ id: "3", name: "Commercial_Spot_30s.docx", words: 112 },
	];

	return (
		<Stack gap="sm">
			<AnimatePresence>
				{items.map((script, i) => (
					<motion.div
						key={script.id}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: i * 0.1 }}
						className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group"
					>
						<Group gap="md">
							<ThemeIcon variant="light" color="forest.0" radius="md">
								<FileText size={16} className="text-forest-9" />
							</ThemeIcon>
							<Text size="sm" fw={600} className="tracking-tight">{script.name}</Text>
						</Group>
						<Text size="xs" fw={700} c="brand-dark.3" className="font-mono">{script.words} WDS</Text>
					</motion.div>
				))}
			</AnimatePresence>
		</Stack>
	);
});
ScriptList.displayName = "ScriptList";

export function BentoFeatures() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-fr">
			
			{/* Feature 1: Built for voice talent */}
			<BentoCard index={0} className="md:col-span-7 md:row-span-2 group">
				<Stack h="100%" justify="space-between">
					<Box>
						<ThemeIcon size={56} variant="light" color="on-air-red" radius="2xl" className="mb-8">
							<Mic size={28} strokeWidth={1.5} />
						</ThemeIcon>
						<h3 className="text-3xl font-sans font-semibold tracking-tight mb-4">
							Built for voice talent.
						</h3>
						<Text className="text-lg text-brand-dark-4 leading-relaxed max-w-[35ch]">
							Line-item invoicing tuned for sessions, pickups, and script-based word counts—so you bill accurately without spreadsheet gymnastics.
						</Text>
					</Box>
					<div className="relative mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100/50 overflow-hidden">
						<ScriptList />
						<div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent pointer-events-none" />
					</div>
				</Stack>
			</BentoCard>

			{/* Feature 2: Script-aware workflow */}
			<BentoCard index={1} className="md:col-span-5 md:row-span-1 bg-forest-9 text-white border-none">
				<Stack h="100%" justify="space-between">
					<Group justify="space-between">
						<ThemeIcon size={44} variant="light" color="sage.0" radius="xl">
							<Activity size={22} className="text-forest-9" />
						</ThemeIcon>
						<ArrowUpRight size={20} className="text-white/30" />
					</Group>
					<Box>
						<h3 className="text-xl font-sans font-semibold tracking-tight mb-2">
							Script-aware workflow
						</h3>
						<Text className="text-sm text-sage-1 opacity-80">
							Parse and review scripts in one place, then flow dialogue counts straight into your invoice items.
						</Text>
					</Box>
				</Stack>
			</BentoCard>

			{/* Feature 3: Calm UI */}
			<BentoCard index={2} className="md:col-span-5 md:row-span-1 border-dashed border-slate-200 bg-slate-50/30">
				<Stack align="center" justify="center" h="100%" className="text-center">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
						className="mb-4"
					>
						<CircleDashed size={48} strokeWidth={1} className="text-slate-300" />
					</motion.div>
					<h3 className="text-lg font-sans font-semibold tracking-tight mb-2">
						Calm, focused UI
					</h3>
					<Text size="sm" className="text-brand-dark-4 max-w-[25ch]">
						A soft, distraction-free workspace that stays out of your way.
					</Text>
				</Stack>
			</BentoCard>

			{/* Feature 4: Professional summaries */}
			<BentoCard index={3} className="md:col-span-12 md:row-span-1">
				<Group justify="space-between" align="center" w="100%">
					<Group gap="xl">
						<ThemeIcon size={56} variant="light" color="studio" radius="2xl">
							<Receipt size={28} strokeWidth={1.5} />
						</ThemeIcon>
						<Stack gap={2}>
							<h3 className="text-2xl font-sans font-semibold tracking-tight">
								Professional summaries
							</h3>
							<Text className="text-brand-dark-4">
								Export clear summaries for clients or your accounting stack.
							</Text>
						</Stack>
					</Group>
					<Box className="hidden lg:flex items-center gap-2 px-6 py-3 bg-studio-50 rounded-full border border-studio-100">
						<Sparkles size={16} className="text-studio-600" />
						<Text size="xs" fw={700} c="studio.7" className="tracking-widest uppercase">AI-Ready Export</Text>
					</Box>
				</Group>
			</BentoCard>
		</div>
	);
}
