import { InvoiceSummary } from "@/features/invoice/components/InvoiceSummary";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import {
  type InvoiceProfile,
  getTodayDateString,
  loadProfileFromStorage,
  profileSchema,
  saveProfileToStorage,
} from "@/features/invoice/utils/invoiceProfile";
import {
  Box,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconAt,
  IconCalendar,
  IconDeviceFloppy,
  IconEdit,
  IconList,
  IconPlus,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function InvoicePage() {
  const { invoice, addEmptyItem } = useInvoiceStore();
  const [newItemName, setNewItemName] = useState<string>("");

  const [profile, setProfile] = useState<InvoiceProfile>(() => ({
    firstName: "",
    lastName: "",
    email: "",
    date: getTodayDateString(),
    invoiceTitle: "Invoice",
  }));
  const [profileSavedMessage, setProfileSavedMessage] = useState<string>("");
  const [isEditingProfile, setIsEditingProfile] = useState(true);

  useEffect(() => {
    const stored = loadProfileFromStorage();
    if (stored) {
      setProfile(stored);
      setIsEditingProfile(false);
    }
  }, []);

  const handleProfileChange =
    (field: keyof InvoiceProfile) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      setProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
      setProfileSavedMessage("");
    };

  const isProfileValid = useMemo(() => {
    return profileSchema.safeParse(profile).success;
  }, [profile]);

  const handleSaveProfile = useCallback(() => {
    if (!isProfileValid) {
      setProfileSavedMessage(
        "Please fill out all required fields correctly before saving.",
      );
      return;
    }
    saveProfileToStorage(profile);
    setProfileSavedMessage("Profile saved.");
    setIsEditingProfile(false);
  }, [isProfileValid, profile]);

  const handleCancelEdit = useCallback(() => {
    const stored = loadProfileFromStorage();
    setProfile(
      stored || {
        firstName: "",
        lastName: "",
        email: "",
        date: getTodayDateString(),
        invoiceTitle: "Invoice",
      },
    );
    setIsEditingProfile(false);
    setProfileSavedMessage("");
  }, []);

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
    <Box
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text fw={700} size="xl" mb="lg">
        Invoice
      </Text>

      <Box style={{ flex: 1, minWidth: 0 }}>
        <Stack gap="lg">
          <Box>
            <Group mb="sm">
              <Divider
                label={
                  <Group gap="xs">
                    <IconUser size={20} />
                    <Text fw={700} size="lg">
                      Profile
                    </Text>
                  </Group>
                }
                labelPosition="left"
                style={{ flex: 1 }}
              />
              <Group gap="xs">
                {profileSavedMessage && (
                  <Text
                    size="xs"
                    c={
                      profileSavedMessage === "Profile saved." ? "teal" : "red"
                    }
                  >
                    {profileSavedMessage}
                  </Text>
                )}
                {isEditingProfile ? (
                  <>
                    <Button
                      onClick={handleCancelEdit}
                      size="xs"
                      variant="subtle"
                      color="red"
                      leftSection={<IconX size={14} />}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={!isProfileValid}
                      size="xs"
                      variant="light"
                      leftSection={<IconDeviceFloppy size={14} />}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditingProfile(true)}
                    size="xs"
                    variant="light"
                    leftSection={<IconEdit size={14} />}
                  >
                    Edit
                  </Button>
                )}
              </Group>
            </Group>
            <Stack gap="sm">
              <Group grow>
                <TextInput
                  label="First name"
                  placeholder="First name"
                  value={profile.firstName}
                  onChange={handleProfileChange("firstName")}
                  required
                  leftSection={<IconUser size={16} />}
                  disabled={!isEditingProfile}
                />
                <TextInput
                  label="Last name"
                  placeholder="Last name"
                  value={profile.lastName}
                  onChange={handleProfileChange("lastName")}
                  required
                  disabled={!isEditingProfile}
                />
              </Group>
              <TextInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={profile.email}
                onChange={handleProfileChange("email")}
                required
                leftSection={<IconAt size={16} />}
                disabled={!isEditingProfile}
              />
              <TextInput
                label="Invoice title"
                placeholder="Invoice title"
                value={profile.invoiceTitle}
                onChange={handleProfileChange("invoiceTitle")}
                disabled={!isEditingProfile}
              />
              <TextInput
                label="Invoice date"
                type="date"
                value={profile.date}
                onChange={handleProfileChange("date")}
                required
                leftSection={<IconCalendar size={16} />}
                disabled={!isEditingProfile}
              />
            </Stack>
          </Box>

          <Box mt="xl">
            <Divider
              mb="sm"
              label={
                <Group gap="xs">
                  <IconList size={20} />
                  <Text fw={700} size="lg">
                    Items
                  </Text>
                </Group>
              }
              labelPosition="left"
            />
            <Group align="flex-end" gap="lg">
              <TextInput
                label="Add Invoice Item(s)"
                placeholder="e.g. Episode 1, Episode 2, Episode 3"
                description="Separate multiple items with a comma to add several items at once."
                value={newItemName}
                onChange={(e) => setNewItemName(e.currentTarget.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                style={{ flex: 1 }}
                size="sm"
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
          </Box>
          {hasItems && <InvoiceSummary profile={profile} />}
        </Stack>
      </Box>
    </Box>
  );
}
