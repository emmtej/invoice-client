import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export interface AuthResponse {
	success: boolean;
	message?: string;
}

interface UserState {
	user: UserProfile | null;
	isLoading: boolean;
	error: string | null;
	login: (credentials: UserLoginCredentials) => Promise<AuthResponse>;
	logout: () => void;
	getIsLoggedIn: () => boolean;
}

const LOCAL_STORAGE_KEY = "user-storage";
const VERSION = 1;

const simulateLogin = async (credentials: UserLoginCredentials) => {
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
			logout: state.logout,
		})),
	);
