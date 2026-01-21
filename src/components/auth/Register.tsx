import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	Group,
	Input,
	PasswordInput,
	Text,
	TextInput,
} from "@mantine/core";
import { IconAt, type ReactNode } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import {
	type RegistrationSchema,
	registrationSchema,
} from "@/utils/validation/authentication";
import { ErrorMessage } from "./ErrorMessage";

export function Register() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegistrationSchema>({
		resolver: zodResolver(registrationSchema),
	});

	const onSubmit = async (data: RegistrationSchema) => {
		setTimeout(() => {}, 2000);
		console.log(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
			<Group grow align="flex-start">
				<Input.Wrapper
					label="First Name"
					error={<ErrorMessage message={errors.firstname?.message} />}
					required={true}
				>
					<TextInput
						type="text"
						placeholder="John"
						{...register("firstname")}
					/>
				</Input.Wrapper>
				<Input.Wrapper
					label="Last Name"
					error={<ErrorMessage message={errors.lastname?.message} />}
					required={true}
				>
					<TextInput
						type="text"
						placeholder="Smith"
						{...register("lastname")}
					/>
				</Input.Wrapper>
			</Group>
			<Input.Wrapper
				label="Email"
				error={<ErrorMessage message={errors.email?.message} />}
				required={true}
			>
				<Input
					type="email"
					placeholder="Email"
					{...register("email")}
					leftSection={<IconAt size={16} />}
				/>
			</Input.Wrapper>
			<Input.Wrapper
				label="Confirm Email"
				error={<ErrorMessage message={errors.confirmEmail?.message} />}
				required={true}
			>
				<Input
					type="email"
					{...register("confirmEmail")}
					leftSection={<IconAt size={16} />}
				/>
			</Input.Wrapper>
			<Group grow>
				<Input.Wrapper
					label="Password"
					error={<ErrorMessage message={errors.password?.message} />}
					required={true}
				>
					<PasswordInput
						type="password"
						{...register("password")}
						placeholder="Length must be 8 to 128 characters"
					/>
				</Input.Wrapper>
				<Input.Wrapper
					label="Confirm Password"
					error={<ErrorMessage message={errors.confirmPassword?.message} />}
					required={true}
				>
					<PasswordInput type="password" {...register("confirmPassword")} />
				</Input.Wrapper>
			</Group>
			<Button
				loaderProps={{ type: "dots" }}
				type="submit"
				loading={isSubmitting}
			>
				Register
			</Button>
		</form>
	);
}
