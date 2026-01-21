import { simulateLogin } from "@/mocks/Auth";
import { create } from "zustand";

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

interface UserState {
	user: UserProfile | null;
	login: (credentials: UserLoginCredentials) => Promise<boolean>;
	setUser: (user: UserProfile | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
	user: null,
	login: async (credentials: UserLoginCredentials): Promise<boolean> => {
		const { status, user } = await simulateLogin(credentials);
		console.log({ status, user });
		if (status === 200) {
			set({ user });
			return true;
		}
		return false;
	},
	setUser: (user) => set({ user }),
}));
