import { Title, type TitleProps } from "@mantine/core";

export function PageTitle({ size, ...props }: TitleProps) {
	return <Title order={1} size={size || "48px"} {...props} />;
}
