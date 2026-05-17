"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type React from "react";
import { useRef } from "react";

interface MagneticWrapperProps {
	children: React.ReactNode;
	strength?: number;
	className?: string;
}

/**
 * MagneticWrapper implements high-agency magnetic micro-physics.
 * Uses useMotionValue and useTransform outside React render cycle for performance.
 */
export function MagneticWrapper({
	children,
	strength = 40,
	className,
}: MagneticWrapperProps) {
	const ref = useRef<HTMLDivElement>(null);

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
	const springX = useSpring(x, springConfig);
	const springY = useSpring(y, springConfig);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!ref.current) return;
		const { clientX, clientY } = e;
		const { left, top, width, height } = ref.current.getBoundingClientRect();
		const centerX = left + width / 2;
		const centerY = top + height / 2;

		const distanceX = clientX - centerX;
		const distanceY = clientY - centerY;

		x.set(distanceX * (strength / 100));
		y.set(distanceY * (strength / 100));
	};

	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<motion.div
			ref={ref}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{
				x: springX,
				y: springY,
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}
