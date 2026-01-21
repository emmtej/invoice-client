import type { ApiErrorResponse } from "@/types/Api";
import type { LoginSchema } from "@/utils/validation/authentication";

const getRandomInRange = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1)) + min;

export const simulateLogin = async (data: LoginSchema): Promise<any> => {
	const { email, password } = data;
	const TEST_EMAIL = "user@email.com";
	const TEST_PASSWORD = "Pass123!!";
	const TEST_LATENCY = getRandomInRange(100, 500);

	await new Promise((resolve) => setTimeout(resolve, TEST_LATENCY));

	if (email === TEST_EMAIL && password === TEST_PASSWORD) {
		return {
			status: 200,
			user: {
				email,
				firstname: "John",
				lastname: "Doe",
				profileImg: "IMG_URL",
				role: "USER",
			},
		};
	} else {
		// 3. Return Error Response matching your Spring Boot structure
		const errorResponse: ApiErrorResponse = {
			timestamp: new Date().toISOString(),
			status: 401,
			error: "Unauthorized",
			message: "Invalid email or password",
			path: "/api/v1/auth/login",
		};

		throw errorResponse;
	}
};
