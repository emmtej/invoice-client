import { Button, Group, Stack, Text } from "@mantine/core";
import { FolderOpen, FolderPlus } from "lucide-react";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";

interface ScriptsEmptyStateProps {
  isRoot: boolean;
  onCreateFolder?: () => void;
  onUpload?: (files: File[]) => void;
  isUploading?: boolean;
}

export function ScriptsEmptyState({
  isRoot,
  onCreateFolder,
  onUpload,
  isUploading,
}: ScriptsEmptyStateProps) {
  return (
    <Stack align="center" py="xl" gap="md">
      <EmptyState
        icon={<FolderOpen size={40} />}
        title={isRoot ? "No scripts yet" : "This folder is empty"}
        description={
          isRoot
            ? "Upload scripts or create a folder to start organizing."
            : "Upload scripts into this folder, or create a subfolder."
        }
        maxDescriptionWidth={280}
      />
      {onCreateFolder && onUpload ? (
        <Group gap="sm" justify="center" wrap="wrap">
          <DocxUploadButton
            onChange={onUpload}
            multiple
            variant="light"
            color="wave"
            loading={isUploading}
          >
            Upload Scripts
          </DocxUploadButton>
          <Button
            color="wave"
            variant="outline"
            leftSection={<FolderPlus size={16} />}
            onClick={onCreateFolder}
          >
            New Folder
          </Button>
        </Group>
      ) : isRoot ? (
        <Text size="sm" c="gray.6" ta="center" maw={320}>
          Use{" "}
          <Text span fw={600} c="gray.7">
            Upload Scripts
          </Text>{" "}
          or{" "}
          <Text span fw={600} c="gray.7">
            New Folder
          </Text>{" "}
          when those actions are available on this page.
        </Text>
      ) : null}
    </Stack>
  );
}
