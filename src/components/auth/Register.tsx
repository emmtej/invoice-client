import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, PasswordInput, TextInput } from "@mantine/core";
import { AtSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/form/FormField";
import {
	type RegistrationSchema,
	registrationSchema,
} from "@/utils/validation/authentication";

export function Register() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegistrationSchema>({
		resolver: zodResolver(registrationSchema),
	});

	const onSubmit = async (data: RegistrationSchema) => {
		console.log(data);
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
						{...register("firstname")}
					/>
				</FormField>
				<FormField label="Last Name" error={errors.lastname?.message} required>
					<TextInput
						type="text"
						placeholder="Smith"
						{...register("lastname")}
					/>
				</FormField>
			</Group>
			<FormField label="Email" error={errors.email?.message} required mb="sm">
				<Input
					type="email"
					placeholder="Email"
					{...register("email")}
					leftSection={<AtSign size={16} />}
				/>
			</FormField>
			<FormField
				label="Confirm Email"
				error={errors.confirmEmail?.message}
				required
				mb="sm"
			>
				<Input
					type="email"
					{...register("confirmEmail")}
					leftSection={<AtSign size={16} />}
				/>
			</FormField>
			<Group grow gap="md" mb="sm">
				<FormField label="Password" error={errors.password?.message} required>
					<PasswordInput
						type="password"
						{...register("password")}
						placeholder="Length must be 8 to 128 characters"
					/>
				</FormField>
				<FormField
					label="Confirm Password"
					error={errors.confirmPassword?.message}
					required
				>
					<PasswordInput type="password" {...register("confirmPassword")} />
				</FormField>
			</Group>
			<Button
				loaderProps={{ type: "dots" }}
				type="submit"
				loading={isSubmitting}
				variant="filled"
			>
				Register
			</Button>
		</form>
	);
}
