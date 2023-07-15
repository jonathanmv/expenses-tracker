import { api } from "@/utils/api";
import { Button, Stack, Text, Timeline, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  if (session?.user) return <LoggedInHome />;

  return <NotLoggedInHome />;
}

function LoggedInHome() {
  return (
    <Stack justify="space-between" h="100%">
      <Stack spacing="xl">
        <ExpensesTimeline />
      </Stack>
      <AddExpenseButton />
    </Stack>
  );
}

function NotLoggedInHome() {
  return (
    <Stack justify="space-between" h="100%">
      <Stack spacing="xl">
        <Title>Welcome to Expenses</Title>
        <Text>
          This is a simple expenses tracker app. You can add expenses and see
          them in a timeline.
        </Text>
      </Stack>
      <SignInButton />
    </Stack>
  );
}

function SignInButton() {
  return (
    <Button variant="outline" fullWidth onClick={() => void signIn()}>
      Sign in with Email
    </Button>
  );
}

function AddExpenseButton() {
  return (
    <Link href="/expenses/add">
      <Button variant="outline" leftIcon={<IconPlus size="1rem" />} fullWidth>
        Add Expense
      </Button>
    </Link>
  );
}

function ExpensesTimeline() {
  const { data: expenses } = api.expense.list.useQuery();

  return (
    <Stack spacing="xl">
      <Title>Timeline</Title>
      <Timeline active={expenses?.length} bulletSize={16} lineWidth={1}>
        {expenses?.map((expense) => (
          <Timeline.Item
            active
            key={expense.id}
            title={`€${expense.amount} ` + (expense.description || "...")}
          >
            <Text color="dimmed" size="sm">
              {new Date(expense.createdAt).toLocaleString()}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </Stack>
  );
}
