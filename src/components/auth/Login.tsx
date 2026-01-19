import { loginSchema } from "@/utils/validation/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Fieldset, Input, PasswordInput } from "@mantine/core";
import { useForm } from "react-hook-form";

export function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data) => console.log(data);
	return (
		<Fieldset>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
				<Input.Wrapper
					label="Email"
					error={errors.email ? errors.email.message?.toString() : <>&nbsp;</>}
					required={true}
				>
					<Input type="email" placeholder="Email" {...register("email")} />
				</Input.Wrapper>
				<Input.Wrapper
					label="Password"
					error={
						errors.password ? errors.password.message?.toString() : <>&nbsp;</>
					}
					required={true}
				>
					<PasswordInput type="password" {...register("password")} />
				</Input.Wrapper>

				<Button loaderProps={{ type: "dots" }} type="submit">
					Login
				</Button>
			</form>
		</Fieldset>
	);
}
