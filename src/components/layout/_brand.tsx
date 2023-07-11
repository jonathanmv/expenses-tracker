import React from "react";
import {
  Group,
  ActionIcon,
  useMantineColorScheme,
  Header,
} from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { Logo } from "./_logo";

export function Brand() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Header height={60}>
      <Group sx={{ height: "100%" }} px={20} position="apart">
        <Logo colorScheme={colorScheme} />
        <ActionIcon
          variant="default"
          onClick={() => toggleColorScheme()}
          size={30}
        >
          {colorScheme === "dark" ? (
            <IconSun size="1rem" />
          ) : (
            <IconMoonStars size="1rem" />
          )}
        </ActionIcon>
      </Group>
    </Header>
  );
}
