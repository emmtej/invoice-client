import * as z from "zod";

const nameSchema = (label: string) => {
	const errorMessage = `${label} must be between 2 and 24 characters.`;
	return z
		.string()
		.trim()
		.min(2, { message: errorMessage })
		.max(24, { message: errorMessage })
		.trim();
};

const passwordSchema = () => {
	const message = `Password must be at least 8 to 128 characters in length.`;
	return z.string().min(8, { message: message }).max(128, { message: message });
};

export const loginSchema = z.object({
	email: z.email().trim(),
	password: z.string(),
});

export const registrationSchema = z
	.object({
		firstname: nameSchema("First name"),
		lastname: nameSchema("Last name"),
		email: z.email().trim(),
		confirmEmail: z.email().trim(),
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
