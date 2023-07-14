import {
  AppShell,
  ColorSchemeProvider,
  MantineProvider,
  Navbar,
  type ColorScheme,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Brand } from "./_brand";
import { MainLinks } from "./_mainLinks";
import { User } from "./_user";

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
  if (!session?.user) return null;

  return (
    <AppShell
      padding="md"
      fixed={false}
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section grow mt="xs">
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section>
            <User />
          </Navbar.Section>
        </Navbar>
      }
      header={<Brand />}
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
      fixed={false}
      header={<Brand />}
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
