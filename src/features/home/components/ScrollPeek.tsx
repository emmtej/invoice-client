"use client";

import { ChevronDown } from "lucide-react";
import { SCROLL_PEEK_COPY } from "../config";

export function ScrollPeek() {
	return (
		<div
			aria-hidden
			className="relative h-28 overflow-hidden border-t md:h-32"
		>
			<p className="pointer-events-none absolute bottom-0 left-1/2 w-full max-w-4xl -translate-x-1/2 translate-y-[42%] px-4 text-center font-sans text-3xl font-semibold tracking-tight opacity-20 md:text-4xl">
				{SCROLL_PEEK_COPY.peekTitle}
			</p>

			<div className="relative z-[2] flex h-full flex-col items-center justify-center gap-3 pt-2">
				<div className="h-px w-20 bg-gray-3" />
				<div className="flex flex-col items-center gap-2">
					<ChevronDown size={20} strokeWidth={1.5} />
					<span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
						{SCROLL_PEEK_COPY.label}
					</span>
				</div>
			</div>
		</div>
	);
}
