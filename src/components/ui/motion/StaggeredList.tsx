"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface StaggeredListProps {
	children: ReactNode[];
	delay?: number;
	stagger?: number;
	className?: string;
}

/**
 * StaggeredList implements staggered orchestration for entry animations.
 */
export function StaggeredList({
	children,
	delay = 0,
	stagger = 0.05,
	className,
}: StaggeredListProps) {
	const container: Variants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: stagger,
				delayChildren: delay,
			},
		},
	};

	const item: Variants = {
		hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
		show: {
			opacity: 1,
			y: 0,
			filter: "blur(0px)",
			transition: {
				type: "spring" as const,
				stiffness: 100,
				damping: 20,
			},
		},
	};

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className={className}
		>
			{children.map((child, i) => (
				<motion.div key={`stagger-item-${i}`} variants={item}>
					{child}
				</motion.div>
			))}
		</motion.div>
	);
}
