import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

// import { simulateLogin } from "@/mocks/Auth";

type UserRole = "ADMIN" | "USER";

export interface UserProfile {
	firstname: string;
	lastname: string;
	email: string;
	role: UserRole;
	profileImgUrl: string;
}

export interface UserLoginCredentials {
	email: string;
	password: string;
}

export interface UserRegistrationCredentials {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	success: boolean;
	message?: string;
}

interface UserState {
	user: UserProfile | null;
	isLoading: boolean;
	error: string | null;
	login: (credentials: UserLoginCredentials) => Promise<AuthResponse>;
	register: (credentials: UserRegistrationCredentials) => Promise<AuthResponse>;
	logout: () => void;
	getIsLoggedIn: () => boolean;
}

const LOCAL_STORAGE_KEY = "user-storage";
const VERSION = 1;

const simulateLogin = async (credentials: UserLoginCredentials) => {
	// DEMO PURPOSE ONLY: Simulates a network request for the portfolio demo.
	// In a real application, replace this with a secure backend authentication flow.
	await new Promise((resolve) => setTimeout(resolve, 1000));
	if (credentials.email === "test@example.com") {
		return {
			user: {
				firstname: "John",
				lastname: "Doe",
				email: credentials.email,
				role: "USER" as UserRole,
				profileImgUrl: "",
			},
		};
	}
	throw new Error("Invalid credentials");
};

const simulateRegister = async (credentials: UserRegistrationCredentials) => {
	// DEMO PURPOSE ONLY: Simulates a network request for the portfolio demo.
	// In a real application, replace this with a secure backend authentication flow.
	await new Promise((resolve) => setTimeout(resolve, 1000));
	if (credentials.email === "test@example.com") {
		throw new Error("User already exists");
	}
	return {
		user: {
			firstname: credentials.firstname,
			lastname: credentials.lastname,
			email: credentials.email,
			role: "USER" as UserRole,
			profileImgUrl: "",
		},
	};
};

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			user: null,
			isLoading: false,
			error: null,

			getIsLoggedIn: () => !!get().user,

			login: async (credentials) => {
				set({ isLoading: true, error: null });

				try {
					const { user } = await simulateLogin(credentials);
					set({ user, isLoading: false });
					return { success: true };
				} catch (error) {
					const message =
						error instanceof Error
							? error.message
							: "An unknown error occurred";
					set({ error: message, isLoading: false });
					return { success: false, message };
				}
			},

			register: async (credentials) => {
				set({ isLoading: true, error: null });

				try {
					const { user } = await simulateRegister(credentials);
					set({ user, isLoading: false });
					return { success: true };
				} catch (error) {
					const message =
						error instanceof Error
							? error.message
							: "An unknown error occurred";
					set({ error: message, isLoading: false });
					return { success: false, message };
				}
			},

			logout: () => {
				set({ user: null, error: null, isLoading: false });
			},
		}),
		{
			name: LOCAL_STORAGE_KEY,
			version: VERSION,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => {
				if (!state.user) return { user: null };
				// Retain the email as it might be needed for display, or exclude sensitive fields only.
				return { user: state.user };
			},
		},
	),
);

export const useUser = () => useUserStore((state) => state.user);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const useUserError = () => useUserStore((state) => state.error);
export const useUserActions = () =>
	useUserStore(
		useShallow((state) => ({
			login: state.login,
			register: state.register,
			logout: state.logout,
		})),
	);
