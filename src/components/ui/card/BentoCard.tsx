import { Box, type BoxProps } from "@mantine/core";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface BentoCardProps extends BoxProps {
	children: ReactNode;
	/** Stagger index for initial entrance animation */
	index?: number;
	/** Motion props for custom animations */
	motionProps?: HTMLMotionProps<"div">;
}

const MotionBox = motion.create(Box as any);

export function BentoCard({
	children,
	index = 0,
	motionProps,
	className,
	...others
}: BentoCardProps) {
	return (
		<MotionBox
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				type: "spring",
				stiffness: 100,
				damping: 20,
				delay: index * 0.1,
			}}
			className={`
				bg-white 
				rounded-[2.5rem] 
				border border-slate-200/50 
				shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] 
				p-8 
				flex flex-col 
				relative 
				overflow-hidden
				${className || ""}
			`}
			{...others}
			{...(motionProps as any)}
		>
			{children}
		</MotionBox>
	);
}
