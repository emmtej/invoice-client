import type { ReactNode } from "react";

interface FadeInViewProps {
	children: ReactNode;
	className?: string;
	/** @deprecated No-op after styling reset */
	delay?: number;
}

export function FadeInView({ children, className }: FadeInViewProps) {
	return <div className={className}>{children}</div>;
}
