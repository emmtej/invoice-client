import { InvoiceSummary } from "@/features/invoice/components/InvoiceSummary";
import { ActiveProfileDisplay } from "@/features/invoice/components/ActiveProfileDisplay";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import {
  type InvoiceProfile,
  type InvoiceProfileWithMeta,
  type ProfilesState,
  deriveProfileLabel,
  getDefaultProfileFromState,
  getEmptyProfile,
  loadProfilesFromStorage,
  profileSchema,
  saveProfilesToStorage,
} from "@/features/invoice/utils/invoiceProfile";
import {
  loadInvoiceDefaults,
  saveInvoiceDefaults,
} from "@/features/invoice/utils/invoiceDefaults";
import {
  Box,
  Button,
  Divider,
  Group,
  Select,
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
  IconStar,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function InvoicePage() {
  const ADD_PROFILE_VALUE = "__add_profile__";
  const { invoice, addEmptyItem } = useInvoiceStore();
  const [newItemName, setNewItemName] = useState<string>("");

  const [profilesState, setProfilesState] = useState<ProfilesState>({
    profiles: [],
    defaultProfileId: undefined,
  });
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<InvoiceProfile>(() =>
    getEmptyProfile(),
  );
  const [profileSavedMessage, setProfileSavedMessage] = useState<string>("");
  const [isEditingProfile, setIsEditingProfile] = useState(true);

  const [invoiceTitle, setInvoiceTitle] = useState<string>(() =>
    loadInvoiceDefaults().invoiceTitle,
  );
  const [invoiceDate, setInvoiceDate] = useState<string>(() =>
    loadInvoiceDefaults().invoiceDate,
  );

  useEffect(() => {
    const loaded = loadProfilesFromStorage();
    if (loaded.profiles.length === 0) {
      setProfilesState({ profiles: [], defaultProfileId: undefined });
      setSelectedProfileId(null);
      setEditingProfile(getEmptyProfile());
      setIsEditingProfile(true);
      return;
    }

    const defaultProfile = getDefaultProfileFromState(loaded);
    setProfilesState(loaded);
    setSelectedProfileId(defaultProfile?.id ?? null);
    setEditingProfile(defaultProfile?.profile ?? getEmptyProfile());
    setIsEditingProfile(false);
  }, []);

  useEffect(() => {
    saveInvoiceDefaults({ invoiceTitle, invoiceDate });
  }, [invoiceTitle, invoiceDate]);

  const handleProfileChange =
    (field: keyof InvoiceProfile) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      setEditingProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
      setProfileSavedMessage("");
    };

  const isProfileValid = useMemo(() => {
    return profileSchema.safeParse(editingProfile).success;
  }, [editingProfile]);

  const handleSaveProfile = useCallback(() => {
    if (!isProfileValid) {
      setProfileSavedMessage(
        "Please fill out all required fields correctly before saving.",
      );
      return;
    }

    const hasProfiles = profilesState.profiles.length > 0;
    const isExistingSelected =
      !!selectedProfileId &&
      profilesState.profiles.some((p) => p.id === selectedProfileId);

    const shouldCreateNewProfile =
      !hasProfiles ||
      !isExistingSelected ||
      selectedProfileId === ADD_PROFILE_VALUE;

    let nextState: ProfilesState;
    let createdId: string | null = null;

    if (shouldCreateNewProfile) {
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `profile_${Date.now().toString(36)}_${Math.random()
            .toString(36)
            .slice(2, 8)}`;

      const newProfile: InvoiceProfileWithMeta = {
        id,
        label: deriveProfileLabel(editingProfile),
        isDefault: !hasProfiles,
        profile: editingProfile,
      };

      nextState = {
        profiles: [...profilesState.profiles, newProfile],
        defaultProfileId: hasProfiles ? profilesState.defaultProfileId : id,
      };
      createdId = id;
    } else {
      const updatedProfiles = profilesState.profiles.map((p) =>
        p.id === selectedProfileId
          ? {
              ...p,
              label: deriveProfileLabel(editingProfile),
              profile: editingProfile,
            }
          : p,
      );

      nextState = {
        profiles: updatedProfiles,
        defaultProfileId: profilesState.defaultProfileId,
      };
    }

    setProfilesState(nextState);
    saveProfilesToStorage(nextState);
    if (createdId !== null) {
      setSelectedProfileId(createdId);
    }
    setIsEditingProfile(false);
    setProfileSavedMessage("Profile saved.");
  }, [editingProfile, isProfileValid, profilesState, selectedProfileId]);

  const handleCancelEdit = useCallback(() => {
    if (profilesState.profiles.length === 0) {
      setEditingProfile(getEmptyProfile());
      setIsEditingProfile(true);
      setProfileSavedMessage("");
      return;
    }

    const defaultProfile = getDefaultProfileFromState(profilesState);
    const currentProfile =
      profilesState.profiles.find((p) => p.id === selectedProfileId) ??
      defaultProfile;

    setSelectedProfileId(currentProfile?.id ?? null);
    setEditingProfile(currentProfile?.profile ?? getEmptyProfile());
    setIsEditingProfile(false);
    setProfileSavedMessage("");
  }, [profilesState, selectedProfileId]);

  const handleSetAsDefault = useCallback(() => {
    if (
      !selectedProfileId ||
      selectedProfileId === ADD_PROFILE_VALUE ||
      selectedProfileId === profilesState.defaultProfileId
    ) {
      return;
    }
    const nextState: ProfilesState = {
      ...profilesState,
      defaultProfileId: selectedProfileId,
    };
    setProfilesState(nextState);
    saveProfilesToStorage(nextState);
    setProfileSavedMessage("Default profile updated.");
  }, [profilesState, selectedProfileId]);

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

  const hasProfiles = profilesState.profiles.length > 0;

  const activeProfileForSummary: InvoiceProfile | undefined = (() => {
    if (isEditingProfile) return editingProfile;
    const current =
      profilesState.profiles.find((p) => p.id === selectedProfileId) ??
      getDefaultProfileFromState(profilesState);
    return current?.profile;
  })();

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
              <Group gap="xs" align="center">
                {hasProfiles && (
                  <Select
                    size="xs"
                    data={[
                      ...profilesState.profiles.map((p) => ({
                        value: p.id,
                        label:
                          p.id === profilesState.defaultProfileId
                            ? `${p.label} (default)`
                            : p.label,
                      })),
                      { value: ADD_PROFILE_VALUE, label: "+ Add profile" },
                    ]}
                    value={selectedProfileId}
                    onChange={(value) => {
                      if (!value) return;

                      if (value === ADD_PROFILE_VALUE) {
                        setSelectedProfileId(ADD_PROFILE_VALUE);
                        setEditingProfile(getEmptyProfile());
                        setIsEditingProfile(true);
                        setProfileSavedMessage("");
                        return;
                      }

                      setSelectedProfileId(value);
                      const selected =
                        profilesState.profiles.find((p) => p.id === value) ??
                        getDefaultProfileFromState(profilesState);
                      setEditingProfile(selected?.profile ?? getEmptyProfile());
                      setIsEditingProfile(false);
                      setProfileSavedMessage("");
                    }}
                    placeholder="Select profile"
                    w={220}
                  />
                )}
                {profileSavedMessage && (
                  <Text
                    size="xs"
                    c={
                      profileSavedMessage === "Profile saved." ||
                      profileSavedMessage === "Default profile updated."
                        ? "teal"
                        : "red"
                    }
                  >
                    {profileSavedMessage}
                  </Text>
                )}
                {isEditingProfile ? (
                  <>
                    {hasProfiles && (
                      <Button
                        onClick={handleCancelEdit}
                        size="xs"
                        variant="subtle"
                        color="red"
                        leftSection={<IconX size={14} />}
                      >
                        Cancel
                      </Button>
                    )}
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
                  <>
                    {hasProfiles &&
                      selectedProfileId &&
                      selectedProfileId !== ADD_PROFILE_VALUE &&
                      selectedProfileId !== profilesState.defaultProfileId && (
                        <Button
                          onClick={handleSetAsDefault}
                          size="xs"
                          variant="subtle"
                          leftSection={<IconStar size={14} />}
                        >
                          Set as default
                        </Button>
                      )}
                    <Button
                      onClick={() => {
                        if (hasProfiles && !selectedProfileId) {
                          const defaultProfile = getDefaultProfileFromState(profilesState);
                          setSelectedProfileId(defaultProfile?.id ?? null);
                          setEditingProfile(defaultProfile?.profile ?? getEmptyProfile());
                        }
                        setIsEditingProfile(true);
                      }}
                      size="xs"
                      variant="light"
                      leftSection={<IconEdit size={14} />}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </Group>
            </Group>
            {(!hasProfiles || isEditingProfile) && (
              <Stack gap="sm">
                {!hasProfiles && (
                  <Text size="xs" c="dimmed">
                    Create your first invoice profile. It will be saved and can be reused
                    later.
                  </Text>
                )}
                <Group grow>
                  <TextInput
                    label="First name"
                    placeholder="First name"
                    value={editingProfile.firstName}
                    onChange={handleProfileChange("firstName")}
                    required
                    leftSection={<IconUser size={16} />}
                  />
                  <TextInput
                    label="Last name"
                    placeholder="Last name"
                    value={editingProfile.lastName}
                    onChange={handleProfileChange("lastName")}
                    required
                  />
                </Group>
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={editingProfile.email}
                  onChange={handleProfileChange("email")}
                  required
                  leftSection={<IconAt size={16} />}
                />
              </Stack>
            )}
            {hasProfiles &&
              selectedProfileId !== null &&
              selectedProfileId !== ADD_PROFILE_VALUE &&
              !isEditingProfile &&
              activeProfileForSummary && (
                <ActiveProfileDisplay profile={activeProfileForSummary} />
              )}
            <Stack gap="sm" mt="md">
              <Text size="sm" fw={600} c="dimmed">
                Invoice details
              </Text>
              <Group grow align="flex-end">
                <TextInput
                  label="Invoice title"
                  placeholder="Invoice"
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.currentTarget.value)}
                />
                <TextInput
                  label="Invoice date"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.currentTarget.value)}
                  leftSection={<IconCalendar size={16} />}
                />
              </Group>
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
          {hasItems && (
            <InvoiceSummary
              profile={activeProfileForSummary}
              invoiceTitle={invoiceTitle}
              invoiceDate={invoiceDate}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
}
