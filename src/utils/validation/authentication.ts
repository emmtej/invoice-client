import * as z from "zod";

const nameSchema = () => {
	const errorMessage = `Must be between 2 and 24 characters.`;
	return z
		.string()
		.trim()
		.min(2, { message: errorMessage })
		.max(24, { message: errorMessage })
		.trim();
};

const passwordSchema = () => {
	const message = `Must be at least 8 to 128 characters in length.`;
	return z
		.string()
		.min(8, { message: message })
		.max(128, { message: message })
		.regex(/[A-Z]/, "Must contain at least one uppercase letter")
		.regex(/[0-9]/, "Must contain at least one number");
};

export const loginSchema = z.object({
	email: z.string().min(1, "Email is required.").email("Invalid email.").trim(),
	password: z.string().min(1, "Password is required."),
});

export const registrationSchema = z
	.object({
		firstname: nameSchema(),
		lastname: nameSchema(),
		email: z.email({ message: "Invalid email." }).trim(),
		confirmEmail: z.email({ message: "Invalid email." }).trim(),
		password: passwordSchema(),
		confirmPassword: z.string().min(1, { message: "Confirmation is required" }),
	})
	.refine((data) => data.email === data.confirmEmail, {
		message: "Emails do not match",
		path: ["confirmEmail"],
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});

export type RegistrationSchema = z.infer<typeof registrationSchema>;

export type LoginSchema = z.infer<typeof loginSchema>;
