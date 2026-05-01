import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/form/FormField";
import { ErrorMessage } from "@/features/auth/components/ErrorMessage";
import { useUserStore } from "@/store/userStore";
import {
	type LoginSchema,
	loginSchema,
	type RegistrationSchema,
	registrationSchema,
} from "@/utils/validation/authentication";

export function LoginFields() {
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
				<TextInput
					type="email"
					placeholder="Email"
					size="md"
					{...register("email")}
				/>
			</FormField>

			<FormField label="Password" error={errors.password?.message} required>
				<PasswordInput type="password" size="md" {...register("password")} />
			</FormField>

			<ErrorMessage message={errors.root?.message} />

			<Button
				loaderProps={{ type: "dots" }}
				type="submit"
				loading={isSubmitting}
				variant="filled"
				size="md"
				mt="lg"
			>
				Login
			</Button>
		</form>
	);
}

export function RegisterFields() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<RegistrationSchema>({
		resolver: zodResolver(registrationSchema),
	});

	// Optionally wire up a register function if added to userStore later
	const registerUser = useUserStore((store) => store.register);
	const navigate = useNavigate();
	const isMountedRef = useRef(true);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const onSubmit = async (data: RegistrationSchema) => {
		if (registerUser) {
			const result = await registerUser(data);
			if (!isMountedRef.current) return;
			if (result.success) {
				await navigate({ to: "/dashboard", replace: true });
			} else {
				setError("root", {
					type: "manual",
					message: result.message,
				});
			}
		} else {
			// Fallback if registerUser is not in store yet
			setError("root", {
				type: "manual",
				message: "Registration is not configured.",
			});
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{ display: "flex", flexDirection: "column" }}
		>
			<Group grow align="flex-start" gap="md" mb="sm">
				<FormField
					label="First Name"
					error={errors.firstname?.message}
					required
				>
					<TextInput
						type="text"
						placeholder="John"
						size="md"
						{...register("firstname")}
					/>
				</FormField>
				<FormField label="Last Name" error={errors.lastname?.message} required>
					<TextInput
						type="text"
						placeholder="Smith"
						size="md"
						{...register("lastname")}
					/>
				</FormField>
			</Group>
			<FormField label="Email" error={errors.email?.message} required mb="sm">
				<TextInput
					type="email"
					placeholder="Email"
					size="md"
					{...register("email")}
				/>
			</FormField>
			<FormField
				label="Confirm Email"
				error={errors.confirmEmail?.message}
				required
				mb="sm"
			>
				<TextInput type="email" size="md" {...register("confirmEmail")} />
			</FormField>
			<Group grow gap="md" mb="sm">
				<FormField label="Password" error={errors.password?.message} required>
					<PasswordInput
						type="password"
						size="md"
						{...register("password")}
						placeholder="8 to 128 chars"
					/>
				</FormField>
				<FormField
					label="Confirm Password"
					error={errors.confirmPassword?.message}
					required
				>
					<PasswordInput
						type="password"
						size="md"
						{...register("confirmPassword")}
					/>
				</FormField>
			</Group>

			<ErrorMessage message={errors.root?.message} />

			<Button
				loaderProps={{ type: "dots" }}
				type="submit"
				loading={isSubmitting}
				variant="filled"
				size="md"
				mt="lg"
			>
				Register
			</Button>
		</form>
	);
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
	return mode === "login" ? <LoginFields /> : <RegisterFields />;
}
