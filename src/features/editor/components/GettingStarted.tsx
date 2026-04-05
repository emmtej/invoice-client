import { Box, Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { CloudUpload, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import { TextEditor } from "./TextEditor";

interface GettingStartedProps {
  onFileChange: (files: File[]) => void;
  onPasteProcessed: (html: string) => void;
}

export function GettingStarted({
  onFileChange,
  onPasteProcessed,
}: GettingStartedProps) {
  const [pastedContent, setPastedContent] = useState("");

  const handleCreateFromPaste = useCallback(() => {
    if (!pastedContent.trim()) return;
    onPasteProcessed(pastedContent);
    setPastedContent("");
  }, [pastedContent, onPasteProcessed]);

  return (
    <Flex direction="column" h="100%" bg="white">
      <Stack
        gap={48}
        px={48}
        py={32}
        flex={1}
        className="overflow-y-auto max-w-[1100px] mx-auto w-full"
      >
        {/* Dynamic Action Area */}
        <Stack gap={32}>
          {/* Upload Documents */}
          <Stack gap="lg">
            <Box px="xs">
              <SectionLabel letterSpacing={2}>Upload Documents</SectionLabel>
            </Box>
            <Paper
              withBorder
              p="md"
              radius="lg"
              bg="white"
              className="border-slate-200 hover:border-slate-300 transition-colors group"
            >
              <Group justify="space-between" align="center" wrap="nowrap">
                <Group gap="md" wrap="nowrap">
                  <Box
                    p="sm"
                    bg="white"
                    className="text-studio-600 shadow-sm group-hover:scale-105 transition-all border border-slate-100"
                    style={{ borderRadius: "var(--mantine-radius-md)" }}
                  >
                    <CloudUpload size={24} strokeWidth={1.5} />
                  </Box>
                  <Stack gap={0}>
                    <Text fw={800} size="sm" c="dark.7" lts={-0.2}>
                      Word Documents (.docx)
                    </Text>
                    <Text size="xs" c="dimmed" fw={500}>
                      Upload files to automatically extract and count dialogue
                      lines.
                    </Text>
                  </Stack>
                </Group>
                <DocxUploadButton
                  onChange={onFileChange}
                  multiple
                  size="sm"
                  radius="md"
                  className="shadow-sm shadow-studio-100 px-6"
                >
                  Select Documents
                </DocxUploadButton>
              </Group>
            </Paper>
          </Stack>
          {/* Paste Script */}
          <Stack gap="lg">
            <Box px="xs">
              <SectionLabel letterSpacing={2}>Paste Script</SectionLabel>
            </Box>
            <Paper
              withBorder
              radius="lg"
              bg="white"
              mih={400}
              className="overflow-hidden flex flex-col shadow-sm border-slate-200 hover:border-slate-300 transition-colors"
            >
              <TextEditor
                content={pastedContent}
                onContentChange={setPastedContent}
                placeholder="Paste your script here (e.g. Speaker: Text) to analyze it instantly..."
                additionalMenu={
                  <Flex gap="xs" align="center">
                    {pastedContent.trim() && (
                      <Button
                        variant="filled"
                        size="sm"
                        color="studio"
                        leftSection={<Plus size={16} />}
                        onClick={handleCreateFromPaste}
                        radius="md"
                        className="shadow-md"
                      >
                        Process Script
                      </Button>
                    )}
                  </Flex>
                }
              />
            </Paper>
          </Stack>
        </Stack>

        {/* Professional Footer Insight */}
        <Box
          p="xl"
          bg="gray.0"
          style={{
            border: "1px solid var(--mantine-color-gray-2)",
            borderRadius: "var(--mantine-radius-xl)",
          }}
        >
          <Group gap={16} wrap="nowrap">
            <Box
              p="xs"
              bg="white"
              className="text-studio-500 shadow-sm shrink-0"
              style={{
                border: "1px solid var(--mantine-color-gray-2)",
                borderRadius: "var(--mantine-radius-md)",
              }}
            >
              <Plus size={16} strokeWidth={3} />
            </Box>
            <Text size="sm" fw={600} c="dark.4" className="leading-relaxed">
              <span className="text-studio-700 font-bold">Pro Tip:</span> Our
              parser identifies dialogue, action lines, and scene markers
              automatically. Only dialogue lines contribute to the billable word
              count.
            </Text>
          </Group>
        </Box>
      </Stack>
    </Flex>
  );
}
