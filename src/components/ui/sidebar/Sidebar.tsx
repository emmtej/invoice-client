import { Box, ScrollArea } from "@mantine/core";
import { FileText, LayoutDashboard, Receipt, User } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { LinksGroup } from "./NavLinksGroup";
import { UserButton } from "./UserButton";

const navlinks = [
  { label: "Home", icon: LayoutDashboard },
  { label: "Profile", icon: User, href: "/profile" },
  {
    label: "Invoice",
    icon: Receipt,
    initiallyOpened: true,
    links: [{ label: "Overview", link: "/invoice" }],
  },
  {
    label: "Script Tools",
    icon: FileText,
    links: [{ label: "Editor", link: "/editor" }],
  },
];

export function Sidebar() {
  const user = useUserStore((store) => store.user);

  const links = navlinks.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <Box
      component="nav"
      bg="white"
      h="100%"
      w={240}
      p="md"
      display="flex"
      style={{
        flexDirection: "column",
        borderRight: "1px solid var(--mantine-color-gray-2)",
      }}
    >
      <ScrollArea flex={1} mx={`calc(var(--mantine-spacing-md) * -1)`}>
        <div>{links}</div>
      </ScrollArea>

      {user && (
        <Box
          mx={`calc(var(--mantine-spacing-md) * -1)`}
          p="md"
          style={{
            borderTop: "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <UserButton user={user} />
        </Box>
      )}
    </Box>
  );
}
