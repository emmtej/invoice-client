import { registrationSchema } from "@/utils/validation/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Fieldset, Group, Input, PasswordInput } from "@mantine/core";

import { useForm } from "react-hook-form";

export function Register() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(registrationSchema),
	});

	const onSubmit = (data) => console.log(data);

	return (
		<Fieldset>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
				<Group grow>
					<Input.Wrapper
						label="First Name"
						error={
							errors.firstname ? (
								errors.firstname.message?.toString()
							) : (
								<>&nbsp;</>
							)
						}
						required={true}
					>
						<Input type="text" placeholder="John" {...register("firstname")} />
					</Input.Wrapper>
					<Input.Wrapper
						label="Last Name"
						error={
							errors.lastname ? (
								errors.lastname.message?.toString()
							) : (
								<>&nbsp;</>
							)
						}
						required={true}
					>
						<Input type="text" placeholder="Smith" {...register("lastname")} />
					</Input.Wrapper>
				</Group>
				<Input.Wrapper
					label="Email"
					error={errors.email ? errors.email.message?.toString() : <>&nbsp;</>}
					required={true}
				>
					<Input type="email" placeholder="Email" {...register("email")} />
				</Input.Wrapper>
				<Input.Wrapper
					label="Confirm Email"
					error={
						errors.confirmEmail ? (
							errors.confirmEmail.message?.toString()
						) : (
							<>&nbsp;</>
						)
					}
					required={true}
				>
					<Input
						type="email"
						placeholder="Confirm Email"
						{...register("confirmEmail")}
					/>
				</Input.Wrapper>
				<Group grow>
					<Input.Wrapper
						label="Password"
						error={
							errors.password ? (
								errors.password.message?.toString()
							) : (
								<>&nbsp;</>
							)
						}
						required={true}
					>
						<PasswordInput type="password" {...register("password")} />
					</Input.Wrapper>
					<Input.Wrapper
						label="Confirm Password"
						error={
							errors.confirmPassword ? (
								errors.confirmPassword.message?.toString()
							) : (
								<>&nbsp;</>
							)
						}
						required={true}
					>
						<PasswordInput type="password" {...register("confirmPassword")} />
					</Input.Wrapper>
				</Group>
				<Button loaderProps={{ type: "dots" }} type="submit">
					Register
				</Button>
			</form>
		</Fieldset>
	);
}
