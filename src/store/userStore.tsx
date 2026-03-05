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

export type AuthResponse =
	| { success: true }
	| { success: false; message: string };

interface UserState {
	user: UserProfile | null;
	isLoading: boolean;
	error: string | null;
	login: (credentials: UserLoginCredentials) => Promise<AuthResponse>;
	logout: () => void;
}

const LOCAL_STORAGE_KEY = "user-storage";
const VERSION = 1;

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
				if (!state.user) return undefined;
				const { email, ...safeUser } = state.user;
				return { user: safeUser as UserProfile };
			},
		},
	),
);

export const useUser = () => useUserStore((state) => state.user);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const useUserError = () => useUserStore((state) => state.error);
export const useUserActions = () =>
	useUserStore((state) => ({
		login: state.login,
		logout: state.logout,
	}));
