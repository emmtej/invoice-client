"use client";

import invoice1 from "@/assets/images/invoice-1-1920.webp";

export function HeroVisual() {
	return (
		<div className="relative w-full lg:-ml-16 lg:mt-[-1.5rem]">
			<div className="rounded-[2rem] p-1.5 ring-1 ring-gray-3 shadow-md">
				<div className="relative aspect-[4/5] overflow-hidden rounded-[calc(2rem-0.375rem)]">
					<img
						src={invoice1}
						alt="InVoice studio interface"
						className="h-full w-full object-cover"
					/>
				</div>
			</div>
		</div>
	);
}
