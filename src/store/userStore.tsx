import { create } from "zustand";

type UserRole = "ADMIN" | "USER";

export interface UserProfile {
	name: string;
	email: string;
	role: UserRole;
	profileImgUrl: string;
}

interface UserState {
	user: UserProfile | null;
	setUser: (user: UserProfile | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
}));
