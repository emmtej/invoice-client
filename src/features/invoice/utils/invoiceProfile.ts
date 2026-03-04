import { z } from "zod";

export type InvoiceProfile = {
	firstName: string;
	lastName: string;
	email: string;
	date: string;
};

export const profileSchema = z.object({
	firstName: z.string().trim().min(2, "First name is required"),
	lastName: z.string().trim().min(2, "Last name is required"),
	email: z.string().email("Invalid email address"),
	date: z.string().trim().min(1, "Date is required"),
});

const PROFILE_STORAGE_KEY = "invoice_profile";

export const getTodayDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export const loadProfileFromStorage = (): InvoiceProfile | null => {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<InvoiceProfile> | null;
		if (!parsed || typeof parsed !== "object") return null;
		return {
			firstName: typeof parsed.firstName === "string" ? parsed.firstName : "",
			lastName: typeof parsed.lastName === "string" ? parsed.lastName : "",
			email: typeof parsed.email === "string" ? parsed.email : "",
			date: typeof parsed.date === "string" && parsed.date !== "" ? parsed.date : getTodayDateString(),
		};
	} catch {
		return null;
	}
};

export const saveProfileToStorage = (profile: InvoiceProfile) => {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
	} catch {
		// Ignore storage errors to avoid breaking the UI
	}
};