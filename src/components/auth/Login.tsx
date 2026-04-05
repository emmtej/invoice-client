import { zodResolver } from "@hookform/resolvers/zod";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/form/FormField";
import { useUserStore } from "@/store/userStore";
import {
	type LoginSchema,
	loginSchema,
} from "@/utils/validation/authentication";

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
	const isMountedRef = useRef(true);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const onSubmit = async (data: LoginSchema) => {
		const result = await login(data);
		if (!isMountedRef.current) return;
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
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{ display: "flex", flexDirection: "column" }}
		>
			<FormField label="Email" error={errors.email?.message} required mb="sm">
				<TextInput type="email" placeholder="Email" {...register("email")} />
			</FormField>

			<FormField
				label="Password"
				error={errors.password?.message}
				required
				mb="sm"
			>
				<PasswordInput type="password" {...register("password")} />
			</FormField>

			<Button
				loaderProps={{ type: "dots" }}
				type="submit"
				loading={isSubmitting}
				variant="filled"
			>
				Login
			</Button>
		</form>
	);
}
