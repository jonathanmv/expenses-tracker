import { AppShell, Navbar } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { Brand } from "./_brand";
import { MainLinks } from "./_mainLinks";
import { User } from "./_user";

export default function AddExpensePage() {
  const { height } = useViewportSize();

  return (
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
      Your content here
    </AppShell>
  );
}
