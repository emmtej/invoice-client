import { ActionIcon, Card, Flex, Text } from "@mantine/core";
import { Folder as FolderIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Folder } from "@/features/storage/types";

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  onDelete: () => void;
}

export function FolderCard({ folder, onClick, onDelete }: FolderCardProps) {
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
      <Flex align="center" justify="space-between">
        <Flex align="center" gap="sm" miw={0}>
          <FolderIcon
            size={20}
            color="var(--mantine-color-studio-5)"
            style={{ flexShrink: 0 }}
          />
          <Text size="sm" fw={600} c="gray.7" truncate>
            {folder.name}
          </Text>
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
