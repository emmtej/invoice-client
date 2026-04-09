import { Box, Stack, UnstyledButton } from "@mantine/core";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Folder, ScriptSummary } from "@/features/storage/types";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import { sortByName } from "../utils/sortByName";
import { FolderCard } from "./FolderCard";
import { ScriptLibraryTile } from "./ScriptLibraryTile";

interface ScriptsLibraryItemsProps {
  folders: Folder[];
  scripts: ScriptSummary[];
  /** Direct child counts per folder id (from store). */
  folderItemCounts: Record<string, number>;
  sortAscending: boolean;
  onSortAscendingChange: (ascending: boolean) => void;
  selectedScriptId: string | null;
  onNavigateFolder: (folderId: string) => void;
  onDeleteFolder: (folder: Folder) => void;
  onSelectScript: (scriptId: string) => void;
  onDeleteScript: (script: ScriptSummary) => void;
}

export function ScriptsLibraryItems({
  folders,
  scripts,
  folderItemCounts,
  sortAscending,
  onSortAscendingChange,
  selectedScriptId,
  onNavigateFolder,
  onDeleteFolder,
  onSelectScript,
  onDeleteScript,
}: ScriptsLibraryItemsProps) {
  const sortedFolders = sortByName(folders, sortAscending);
  const sortedScripts = sortByName(scripts, sortAscending);

  return (
    <Stack gap="lg">
      <Box px="md">
        <UnstyledButton
          onClick={() => onSortAscendingChange(!sortAscending)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            marginLeft: "-8px",
            borderRadius: "4px",
            transition: "background-color 150ms ease",
          }}
          styles={{
            root: {
              "&:hover": {
                backgroundColor: "var(--mantine-color-gray-1)",
              },
            },
          }}
        >
          <SectionLabel size="xs" c="gray.6">
            Name
          </SectionLabel>
          {sortAscending ? (
            <ArrowUp size={14} color="var(--mantine-color-gray-5)" />
          ) : (
            <ArrowDown size={14} color="var(--mantine-color-gray-5)" />
          )}
        </UnstyledButton>
      </Box>

      {sortedFolders.length > 0 && (
        <Stack gap="xs" w="100%">
          {sortedFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              itemCount={folderItemCounts[folder.id] ?? 0}
              onClick={() => onNavigateFolder(folder.id)}
              onDelete={() => onDeleteFolder(folder)}
            />
          ))}
        </Stack>
      )}

      {sortedScripts.length > 0 && (
        <Stack gap="xs" w="100%">
          {sortedScripts.map((script) => (
            <ScriptLibraryTile
              key={script.id}
              script={script}
              isSelected={script.id === selectedScriptId}
              onClick={() => onSelectScript(script.id)}
              onDelete={() => onDeleteScript(script)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
