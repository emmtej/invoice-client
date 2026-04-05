import { Box, Breadcrumbs, Flex, Text } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import Scripts from "./components/Scripts";

export default function EditorPage() {
  return (
    <Flex direction="column" h="100%" rowGap={6}>
      {/* Breadcrumb Orientation */}
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
              className="text-slate-300"
            />
          }
          separatorMargin="md"
        >
          <Text size="xs" fw={800} tt="uppercase" lts={1.5} c="dimmed">
            Script Tools
          </Text>
          <Text size="xs" fw={900} tt="uppercase" lts={1.5} c="dark.9">
            Editor
          </Text>
        </Breadcrumbs>
      </Box>

      {/* Main Editor Content */}
      <Box flex={1} mih={0}>
        <Scripts />
      </Box>
    </Flex>
  );
}
