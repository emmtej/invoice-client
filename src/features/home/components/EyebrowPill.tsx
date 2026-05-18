interface EyebrowPillProps {
	children: string;
	className?: string;
}

export function EyebrowPill({ children, className = "" }: EyebrowPillProps) {
	return (
		<span
			className={`inline-flex items-center rounded-none border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${className}`}
		>
			{children}
		</span>
	);
}
