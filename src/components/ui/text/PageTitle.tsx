import { Title, type TitleProps } from "@mantine/core";

export function PageTitle({ className, size, ...props }: TitleProps) {
	return (
		<Title
			order={1}
			size={size || "48px"}
			className={["page-title text-balance", className]
				.filter(Boolean)
				.join(" ")}
			{...props}
		/>
	);
}
