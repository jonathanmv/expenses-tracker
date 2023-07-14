import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { IconCirclePlus, IconListNumbers } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  href: string;
}

function MainLink({ icon, color, label, href }: MainLinkProps) {
  return (
    <Link href={href}>
      <UnstyledButton
        sx={(theme) => ({
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
        })}
      >
        <Group>
          <ThemeIcon color={color}>{icon}</ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
}

const data = [
  {
    icon: <IconCirclePlus size="1rem" />,
    color: "lime.6",
    label: "Add Expense",
    href: "/expenses/add",
  },
  {
    icon: <IconListNumbers size="1rem" />,
    color: "blue.6",
    label: "Expenses",
    href: "/expenses",
  },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
