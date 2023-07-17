import { api } from "@/utils/api";
import {
  Affix,
  Button,
  List,
  Stack,
  Text,
  Timeline,
  Title,
  Transition,
  rem,
} from "@mantine/core";
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
      <ExpensesTimeline />
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
    <Affix position={{ bottom: rem(20), right: rem(20) }}>
      <Transition transition="slide-up" mounted={true}>
        {(transitionStyles) => (
          <Link href="/expenses/add">
            <Button
              style={transitionStyles}
              variant="outline"
              leftIcon={<IconPlus size="1rem" />}
            >
              Add Expense
            </Button>
          </Link>
        )}
      </Transition>
    </Affix>
  );
}

function ExpensesTimeline() {
  const { data: expenses } = api.expense.list.useQuery();
  const { data: grouped } = api.expense.groupedByDate.useQuery();

  console.log("grouped", grouped);

  const getDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  const today = new Date();
  const formatter = new Intl.DateTimeFormat();
  const relativeFormatter = new Intl.RelativeTimeFormat();
  const format = (date: Date) => {
    const days = daysAgo(date);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return relativeFormatter.format(-days, "day");
    return formatter.format(date);
  };
  const daysAgo = (date: Date) => {
    const diff = today.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <Stack spacing="xl">
      <Title>Timeline</Title>
      <Timeline active={grouped?.length} bulletSize={16} lineWidth={1}>
        {grouped?.map((group) => (
          <Timeline.Item
            active
            key={group.createdDate.toISOString()}
            title={`${format(group.createdDate)} €${group.amount}`}
          >
            <List spacing="sm">
              {expenses
                ?.filter(
                  (expense) =>
                    getDate(expense.createdAt) === getDate(group.createdDate)
                )
                .map((expense) => (
                  <List.Item key={expense.createdAt.toISOString()}>
                    <Link href={`/expenses/${expense.id}`}>
                      <Text color="dimmed" size="sm">
                        € {expense.amount} {expense.description}
                      </Text>
                    </Link>
                  </List.Item>
                ))}
            </List>
          </Timeline.Item>
        ))}
      </Timeline>
    </Stack>
  );
}
