import { ActionIcon, Card, Flex, Stack, Text } from "@mantine/core";
import {
  Folder as FolderIcon,
  FolderOpen,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Folder } from "@/features/storage/types";

interface FolderCardProps {
  folder: Folder;
  /** Direct items in this folder: subfolders plus scripts. */
  itemCount: number;
  onClick: () => void;
  onDelete: () => void;
}

export function FolderCard({
  folder,
  itemCount,
  onClick,
  onDelete,
}: FolderCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      bg="gray.0"
      shadow="xs"
      py="sm"
      px="md"
      withBorder
      w="100%"
      radius="sm"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      styles={{
        root: {
          cursor: "pointer",
          borderColor: "var(--mantine-color-gray-2)",
          transition: "border-color 150ms ease, background-color 150ms ease",
          "&:hover": {
            borderColor: "var(--mantine-color-wave-3)",
          },
        },
      }}
    >
      <Flex align="flex-start" justify="space-between" gap="sm">
        <Flex align="flex-start" gap="sm" miw={0} style={{ flex: 1 }}>
          <FolderIcon
            size={20}
            color="var(--mantine-color-studio-5)"
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <Stack gap={4} miw={0} style={{ flex: 1 }}>
            <Text size="sm" fw={600} c="gray.7" truncate>
              {folder.name}
            </Text>
            {itemCount > 0 ? (
              <Text size="xs" c="gray.5" className="tabular-nums">
                {itemCount === 1 ? "1 item" : `${itemCount} items`}
              </Text>
            ) : (
              <Flex align="center" gap={6}>
                <FolderOpen
                  size={14}
                  strokeWidth={2}
                  color="var(--mantine-color-gray-4)"
                  style={{ flexShrink: 0 }}
                  aria-hidden
                />
                <Text size="xs" c="gray.5">
                  Empty
                </Text>
              </Flex>
            )}
          </Stack>
        </Flex>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            flexShrink: 0,
            opacity: hovered ? 1 : 0,
            transition: "opacity 150ms ease",
            "&:hover": { color: "var(--mantine-color-red-6)" },
          }}
        >
          <Trash2 size={14} />
        </ActionIcon>
      </Flex>
    </Card>
  );
}
