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
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { SCRIPT_LIBRARY_LIST_MAX_WIDTH } from "@/components/ui/layout/layout-constants";
import {
  pgliteStore,
  processDocuments,
  useFileUpload,
} from "@/features/editor";
import type { Folder, ScriptSummary } from "@/features/storage/types";
import { useScriptsLibraryStore } from "./store/scriptsLibraryStore";
import { BreadcrumbNav } from "./components/BreadcrumbNav";
import { PreviewPanel } from "./components/PreviewPanel";
import { ScriptsLibraryItems } from "./components/ScriptsLibraryItems";
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
    refresh,
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

  const {
    docFiles,
    isLoading: isUploading,
    errors: uploadErrors,
    handleFileChange,
    reset: resetUpload,
  } = useFileUpload();

  const [
    createFolderOpened,
    { open: openCreateFolder, close: closeCreateFolder },
  ] = useDisclosure(false);
  const [deleteFolderTarget, setDeleteFolderTarget] = useState<Folder | null>(
    null,
  );
  const [deleteScriptTarget, setDeleteScriptTarget] =
    useState<ScriptSummary | null>(null);
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (docFiles.length === 0) return;
    let cancelled = false;

    (async () => {
      const newScripts = processDocuments(docFiles).map((s) => ({
        ...s,
        folderId: currentFolderId,
      }));
      await pgliteStore.saveScripts(newScripts);
      if (cancelled) return;
      await refresh();
      resetUpload();
    })();

    return () => {
      cancelled = true;
    };
  }, [docFiles]); // eslint-disable-line react-hooks/exhaustive-deps

  const isRoot = currentFolderId === null;
  const isEmpty = folders.length === 0 && scripts.length === 0;
  const currentFolderName =
    breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].name : undefined;

  const listColumnProps = {
    maw: SCRIPT_LIBRARY_LIST_MAX_WIDTH,
    mx: "auto" as const,
    w: "100%" as const,
  };

  return (
    <Flex direction="column" h="100%" rowGap={6}>
      {/* Breadcrumb orientation bar */}
      <Box
        px="md"
        py="xs"
        {...listColumnProps}
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
      <Box px="md" pt="md" {...listColumnProps}>
        <PageTitle>Scripts</PageTitle>
        {uploadErrors.length > 0 && (
          <Alert
            color="red"
            icon={<AlertCircle size={16} />}
            mt="sm"
            withCloseButton
            onClose={resetUpload}
          >
            {uploadErrors.map((err) => (
              <Text key={err} size="sm">
                {err}
              </Text>
            ))}
          </Alert>
        )}
      </Box>

      {/* Folder breadcrumb navigation */}
      {breadcrumb.length > 0 && (
        <Box px="md" {...listColumnProps}>
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
        <Box flex={1} px="md" {...listColumnProps}>
          <ScriptsEmptyState
            isRoot={isRoot}
            onCreateFolder={openCreateFolder}
            onUpload={handleFileChange}
            isUploading={isUploading}
          />
        </Box>
      ) : (
        <Flex flex={1} mih={0}>
          <Box flex={1} p="md" miw={0} style={{ overflowY: "auto" }}>
            <Box {...listColumnProps}>
              <ScriptsLibraryItems
                folders={folders}
                scripts={scripts}
                sortAscending={sortAscending}
                onSortAscendingChange={setSortAscending}
                selectedScriptId={selectedScript?.id ?? null}
                onNavigateFolder={navigateToFolder}
                onDeleteFolder={(folder) => setDeleteFolderTarget(folder)}
                onSelectScript={selectScript}
                onDeleteScript={(script) => setDeleteScriptTarget(script)}
              />
              <Group justify="center" gap="sm" wrap="wrap" pt="lg">
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
            </Box>
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
