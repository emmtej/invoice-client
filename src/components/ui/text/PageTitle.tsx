import { Title, type TitleProps } from "@mantine/core";

export function PageTitle({ className, ...props }: TitleProps) {
	return (
		<Title
			order={1}
			size="48px"
			className={["page-title text-balance", className].filter(Boolean).join(" ")}
			{...props}
		/>
	);
}
