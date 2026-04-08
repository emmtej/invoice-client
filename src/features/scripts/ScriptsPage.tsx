import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Center,
  Flex,
  Group,
  Loader,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AlertCircle, ChevronRight, FolderPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { pgliteStore, processDocuments, useFileUpload } from "@/features/editor";
import type { Folder, ScriptSummary } from "@/features/storage/types";
import { useScriptsLibraryStore } from "./store/scriptsLibraryStore";
import { BreadcrumbNav } from "./components/BreadcrumbNav";
import { FolderSection } from "./components/FolderSection";
import { ScriptSection } from "./components/ScriptSection";
import { PreviewPanel } from "./components/PreviewPanel";
import { CreateFolderModal } from "./components/CreateFolderModal";
import { DeleteFolderModal } from "./components/DeleteFolderModal";
import { DeleteScriptModal } from "./components/DeleteScriptModal";
import { ScriptsEmptyState } from "./components/ScriptsEmptyState";

export default function ScriptsPage() {
  const {
    currentFolderId,
    breadcrumb,
    folders,
    scripts,
    selectedScript,
    isLoading,
    isPreviewLoading,
    init,
    navigateToFolder,
    createFolder,
    deleteFolder,
    deleteScript,
    selectScript,
    clearSelection,
  } = useScriptsLibraryStore(
    useShallow((s) => ({
      currentFolderId: s.currentFolderId,
      breadcrumb: s.breadcrumb,
      folders: s.folders,
      scripts: s.scripts,
      selectedScript: s.selectedScript,
      isLoading: s.isLoading,
      isPreviewLoading: s.isPreviewLoading,
      init: s.init,
      navigateToFolder: s.navigateToFolder,
      createFolder: s.createFolder,
      deleteFolder: s.deleteFolder,
      deleteScript: s.deleteScript,
      selectScript: s.selectScript,
      clearSelection: s.clearSelection,
      refresh: s.refresh,
    })),
  );

  const { docFiles, isLoading: isUploading, errors: uploadErrors, handleFileChange, reset: resetUpload } = useFileUpload();

  const [
    createFolderOpened,
    { open: openCreateFolder, close: closeCreateFolder },
  ] = useDisclosure(false);
  const [deleteFolderTarget, setDeleteFolderTarget] = useState<Folder | null>(
    null,
  );
  const [deleteScriptTarget, setDeleteScriptTarget] =
    useState<ScriptSummary | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  const handleUploadedFiles = useCallback(async () => {
    if (docFiles.length === 0) return;
    const newScripts = processDocuments(docFiles).map((s) => ({
      ...s,
      folderId: currentFolderId,
    }));
    await pgliteStore.saveScripts(newScripts);
    resetUpload();
    await refresh();
  }, [docFiles, currentFolderId, resetUpload, refresh]);

  useEffect(() => {
    if (docFiles.length > 0) {
      handleUploadedFiles();
    }
  }, [docFiles, handleUploadedFiles]);

  const isRoot = currentFolderId === null;
  const isEmpty = folders.length === 0 && scripts.length === 0;
  const currentFolderName =
    breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].name : undefined;

  return (
    <Flex direction="column" h="100%" rowGap={6}>
      {/* Breadcrumb orientation bar */}
      <Box
        px="md"
        py="xs"
        style={(theme) => ({
          borderBottom: `1px solid ${theme.colors.gray[1]}`,
        })}
      >
        <Breadcrumbs
          separator={
            <ChevronRight
              size={14}
              strokeWidth={2.5}
              className="text-gray-300"
            />
          }
          separatorMargin="md"
        >
          <Text size="xs" fw={800} tt="uppercase" lts={1.5} c="gray.5">
            Script Tools
          </Text>
          <Text size="xs" fw={900} tt="uppercase" lts={1.5} c="gray.8">
            Scripts
          </Text>
        </Breadcrumbs>
      </Box>

      {/* Page header */}
      <Box px="md" pt="md">
        <Flex justify="space-between" align="center">
          <PageTitle>Scripts</PageTitle>
          <Group gap="sm">
            <DocxUploadButton
              onChange={handleFileChange}
              multiple
              variant="light"
              color="wave"
              loading={isUploading}
            >
              Upload Scripts
            </DocxUploadButton>
            <Button
              color="wave"
              leftSection={<FolderPlus size={16} />}
              onClick={openCreateFolder}
            >
              New Folder
            </Button>
          </Group>
        </Flex>
        {uploadErrors.length > 0 && (
          <Alert
            color="red"
            icon={<AlertCircle size={16} />}
            mt="sm"
            withCloseButton
            onClose={resetUpload}
          >
            {uploadErrors.map((err) => (
              <Text key={err} size="sm">{err}</Text>
            ))}
          </Alert>
        )}
      </Box>

      {/* Folder breadcrumb navigation */}
      {breadcrumb.length > 0 && (
        <Box px="md">
          <BreadcrumbNav
            breadcrumb={breadcrumb}
            onNavigate={navigateToFolder}
          />
        </Box>
      )}

      {/* Content area */}
      {isLoading ? (
        <Center flex={1}>
          <Loader color="wave" size="sm" />
        </Center>
      ) : isEmpty ? (
        <ScriptsEmptyState
          isRoot={isRoot}
          onCreateFolder={openCreateFolder}
          onUpload={handleFileChange}
          isUploading={isUploading}
        />
      ) : (
        <Flex flex={1} mih={0}>
          <Box flex={1} p="md" style={{ overflowY: "auto" }}>
            {folders.length > 0 && (
              <FolderSection
                folders={folders}
                onNavigate={navigateToFolder}
                onDelete={(folder) => setDeleteFolderTarget(folder)}
              />
            )}
            {scripts.length > 0 && (
              <ScriptSection
                scripts={scripts}
                selectedScriptId={selectedScript?.id ?? null}
                onSelect={selectScript}
                onDelete={(script) => setDeleteScriptTarget(script)}
              />
            )}
          </Box>

          {selectedScript && (
            <PreviewPanel
              script={selectedScript}
              isLoading={isPreviewLoading}
              onClose={clearSelection}
            />
          )}
        </Flex>
      )}

      {/* Modals */}
      <CreateFolderModal
        opened={createFolderOpened}
        onClose={closeCreateFolder}
        onConfirm={async (name) => {
          await createFolder(name, currentFolderId);
          closeCreateFolder();
        }}
        parentFolderName={currentFolderName}
      />
      <DeleteFolderModal
        opened={deleteFolderTarget !== null}
        onClose={() => setDeleteFolderTarget(null)}
        onConfirm={async () => {
          if (deleteFolderTarget) {
            await deleteFolder(deleteFolderTarget.id);
            setDeleteFolderTarget(null);
          }
        }}
        folderName={deleteFolderTarget?.name ?? ""}
      />
      <DeleteScriptModal
        opened={deleteScriptTarget !== null}
        onClose={() => setDeleteScriptTarget(null)}
        onConfirm={async () => {
          if (deleteScriptTarget) {
            await deleteScript(deleteScriptTarget.id);
            setDeleteScriptTarget(null);
          }
        }}
        scriptName={deleteScriptTarget?.name ?? ""}
      />
    </Flex>
  );
}
