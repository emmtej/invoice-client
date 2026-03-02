import { zodResolver } from "@hookform/resolvers/zod";
import { Anchor, Button, Input, PasswordInput, TextInput } from "@mantine/core";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/store/userStore";
import {
	type LoginSchema,
	loginSchema,
} from "@/utils/validation/authentication";
import { ErrorMessage } from "./ErrorMessage";

export function Login() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
	});

	const { login } = useUserStore((store) => store);
	const navigate = useNavigate();

	const onSubmit = async (data: LoginSchema) => {
		const result = await login(data);
		if (result.success) {
			await navigate({ to: "/dashboard", replace: true });
		} else {
			setError("root", {
				type: "manual",
				message: result.message,
			});
		}
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
			<Input.Wrapper
				label="Email"
				error={<ErrorMessage message={errors.email?.message} />}
				required={true}
			>
				<TextInput type="email" placeholder="Email" {...register("email")} />
			</Input.Wrapper>

			<Input.Wrapper
				label="Password"
				error={<ErrorMessage message={errors.password?.message} />}
				required={true}
			>
				<PasswordInput type="password" {...register("password")} />
			</Input.Wrapper>
			<Anchor
				component={Link}
				to="/forgot-password"
				size="sm"
				ta={"right"}
				display={"block"}
				pb={10}
			>
				Forgot Password?
			</Anchor>

			<Button
				loaderProps={{ type: "dots" }}
				type="submit"
				loading={isSubmitting}
			>
				Login
			</Button>
		</form>
	);
}
