import {
  ActionIcon,
  AppShell,
  ColorSchemeProvider,
  Group,
  Header,
  MantineProvider,
  Text,
  type ColorScheme,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { IconSettings, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const Layout = session?.user ? LoggedInLayout : NotLoggedInLayout;

  return (
    <UI>
      <Layout>{children}</Layout>
    </UI>
  );
}

const UI: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // hook will return either 'dark' or 'light' on client
  // and always 'light' during ssr as window.matchMedia is not available
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(preferredColorScheme);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

const LoggedInLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const { pathname } = useRouter();
  const topHref = pathname == "/profile" ? "/" : "/profile";
  if (!session?.user) return null;

  return (
    <AppShell
      padding="md"
      header={
        <Header height={{ base: 60, md: 70 }} p="md">
          <Group position="apart">
            <Text>Expenses Tracker</Text>

            <Link href={topHref}>
              <ActionIcon>
                {pathname == "/profile" ? (
                  <IconX size="1.25rem" />
                ) : (
                  <IconSettings size="1.25rem" />
                )}
              </ActionIcon>
            </Link>
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};

const NotLoggedInLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AppShell
      padding="md"
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};
