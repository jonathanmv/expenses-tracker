import {
  Avatar,
  Box,
  Group,
  Text,
  UnstyledButton,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function User() {
  const theme = useMantineTheme();
  const { data: session } = useSession();
  if (!session?.user) return null;
  const { name, email, image } = session.user;

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `${rem(1)} solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <Link href="/profile">
        <UnstyledButton
          sx={{
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          }}
        >
          <Group>
            <Avatar src={image} radius="xl" />
            <Box sx={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {name}
              </Text>
              <Text color="dimmed" size="xs">
                {email}
              </Text>
            </Box>

            {theme.dir === "ltr" ? (
              <IconChevronRight size={rem(18)} />
            ) : (
              <IconChevronLeft size={rem(18)} />
            )}
          </Group>
        </UnstyledButton>
      </Link>
    </Box>
  );
}
