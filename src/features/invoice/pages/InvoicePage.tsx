import { InvoiceSummary } from "@/features/invoice/components/InvoiceSummary";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import { Box, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { IconAt, IconCalendar, IconDeviceFloppy, IconPlus, IconUser } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type InvoiceProfile = {
	firstName: string;
	lastName: string;
	email: string;
	date: string;
};

const PROFILE_STORAGE_KEY = "invoice_profile";

const getTodayDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const loadProfileFromStorage = (): InvoiceProfile | null => {
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

const saveProfileToStorage = (profile: InvoiceProfile) => {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
	} catch {
		// Ignore storage errors to avoid breaking the UI
	}
};

export default function InvoicePage() {
	const { invoice, addEmptyItem } = useInvoiceStore();
	const [newItemName, setNewItemName] = useState<string>("");

	const [profile, setProfile] = useState<InvoiceProfile>(() => ({
		firstName: "",
		lastName: "",
		email: "",
		date: getTodayDateString(),
	}));
	const [profileSavedMessage, setProfileSavedMessage] = useState<string>("");

	useEffect(() => {
		const stored = loadProfileFromStorage();
		if (stored) {
			setProfile(stored);
		}
	}, []);

	const handleProfileChange =
		(field: keyof InvoiceProfile) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.currentTarget.value;
			setProfile((prev) => ({
				...prev,
				[field]: value,
			}));
			setProfileSavedMessage("");
		};

	const isProfileValid = useMemo(() => {
		if (!profile.firstName.trim()) return false;
		if (!profile.lastName.trim()) return false;
		if (!profile.email.trim() || !profile.email.includes("@")) return false;
		if (!profile.date.trim()) return false;
		return true;
	}, [profile]);

	const handleSaveProfile = useCallback(() => {
		if (!isProfileValid) {
			setProfileSavedMessage("Please fill out all required fields correctly before saving.");
			return;
		}
		saveProfileToStorage(profile);
		setProfileSavedMessage("Profile saved.");
	}, [isProfileValid, profile]);

	const handleAddItem = useCallback(() => {
		const names = newItemName
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
		if (names.length === 0) {
			addEmptyItem("New item");
		} else {
			names.forEach((name) => addEmptyItem(name));
		}
		setNewItemName("");
	}, [addEmptyItem, newItemName]);

	const hasItems = invoice.items.length > 0;

	return (
		<Box style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
			<Text fw={700} size="lg" mb="lg">
				Invoice
			</Text>

			<Box style={{ flex: 1, minWidth: 0 }}>
				<Stack gap="lg">
					<Box>
						<Text fw={600} mb="sm">
							Your details
						</Text>
						<Stack gap="sm">
							<Group grow>
								<TextInput
									label="First name"
									placeholder="First name"
									value={profile.firstName}
									onChange={handleProfileChange("firstName")}
									required
									leftSection={<IconUser size={16} />}
								/>
								<TextInput
									label="Last name"
									placeholder="Last name"
									value={profile.lastName}
									onChange={handleProfileChange("lastName")}
									required
									leftSection={<IconUser size={16} />}
								/>
							</Group>
							<TextInput
								label="Payable email"
								type="email"
								placeholder="you@example.com"
								value={profile.email}
								onChange={handleProfileChange("email")}
								required
								leftSection={<IconAt size={16} />}
							/>
							<TextInput
								label="Invoice date"
								type="date"
								value={profile.date}
								onChange={handleProfileChange("date")}
								required
								leftSection={<IconCalendar size={16} />}
							/>
							<Group justify="space-between" align="center" mt="xs">
								<Button onClick={handleSaveProfile} disabled={!isProfileValid} size="sm" leftSection={<IconDeviceFloppy size={16} />}>
									Save profile
								</Button>
								{profileSavedMessage && (
									<Text size="sm" c={profileSavedMessage === "Profile saved." ? "teal" : "red"}>
										{profileSavedMessage}
									</Text>
								)}
							</Group>
						</Stack>
					</Box>

					<Group align="flex-end" gap="lg">
						<TextInput
							label="Item name(s)"
							placeholder="e.g. Episode 1, Episode 2, Episode 3"
							description="Separate multiple names with a comma to add several items at once."
							value={newItemName}
							onChange={(e) => setNewItemName(e.currentTarget.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
							style={{ flex: 1 }}
							size="md"
						/>
						<Button
							leftSection={<IconPlus size={16} />}
							onClick={handleAddItem}
							variant="filled"
							size="md"
							disabled={!newItemName.trim()}
						>
							Add item
						</Button>
					</Group>
					{hasItems && <InvoiceSummary />}
				</Stack>
			</Box>
		</Box>
	);
}
