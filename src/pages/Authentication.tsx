import { AuthForm } from "@/components/auth/AuthForm";
import { OAuthProviders } from "@/components/auth/OAuthProviders";
import {
  Anchor,
  Box,
  Container,
  Divider,
  Flex,
  Paper,
  SegmentedControl,
  Title,
} from "@mantine/core";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";

function Authentication() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isRegistering = pathname.includes("register");

  const handleModeChange = (value: string) => {
    if (value === "login") {
      navigate({ to: "/login", replace: true });
    } else {
      navigate({ to: "/register", replace: true });
    }
  };

  return (
    <Box>
      {/* TODO: ADD BREADCRUMB */}
      <Container style={{ position: "relative", zIndex: 1 }} size={"xl"}>
        <Flex justify="center" align="center" py={60}>
          <Paper
            bg="white"
            display="flex"
            style={{ overflow: "hidden", minHeight: 650 }}
            w="100%"
            maw={1000}
          >
            {/* Left Form Column */}
            <Box
              p={{ base: "xl", md: 40 }}
              w={{ base: "100%", md: "50%" }}
              display="flex"
              style={{ flexDirection: "column", justifyContent: "center" }}
            >
              <Title
                order={2}
                fw={800}
                size="h2"
                mb="lg"
                className="tracking-tight text-balance"
              >
                Get Started with InVoice
              </Title>
              <SegmentedControl
                value={isRegistering ? "register" : "login"}
                onChange={handleModeChange}
                data={[
                  { label: "Log in", value: "login" },
                  { label: "Sign up", value: "register" },
                ]}
                fullWidth
                mb="xl"
              />
              <AuthForm mode={isRegistering ? "register" : "login"} />
              <Box py="xs" mt="sm">
                <Anchor
                  component={Link}
                  to={isRegistering ? "/login" : "/register"}
                  display="block"
                  size="sm"
                  c="wave.7"
                >
                  {isRegistering
                    ? "Already have an account? Login"
                    : "Don't have an account? Sign up"}
                </Anchor>
              </Box>
              <Divider my="md" label="Or continue with" />
              <OAuthProviders />
            </Box>

            {/* Right Image Column */}
            <Box
              w={{ base: "0%", md: "50%" }}
              display={{ base: "none", md: "block" }}
              style={{ position: "relative" }}
            >
              <Flex
                h="100%"
                w="100%"
                bg="gray.0"
                direction="column"
                align="center"
                justify="center"
                style={{ color: "var(--mantine-color-gray-4)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginBottom: "1rem" }}
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <Title order={4} fw={500} c="gray.5">
                  Image Placeholder
                </Title>
              </Flex>
            </Box>
          </Paper>
        </Flex>
      </Container>
    </Box>
  );
}

export default Authentication;
