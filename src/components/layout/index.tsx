import {
  AppShell,
  ColorSchemeProvider,
  MantineProvider,
  Navbar,
  type ColorScheme,
} from "@mantine/core";
import { useColorScheme, useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { Brand } from "./_brand";
import { MainLinks } from "./_mainLinks";
import { User } from "./_user";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { height } = useViewportSize();

  return (
    <UI>
      <AppShell
        padding="md"
        fixed={false}
        navbar={
          <Navbar width={{ base: 300 }} height={height - 60} p="xs">
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
