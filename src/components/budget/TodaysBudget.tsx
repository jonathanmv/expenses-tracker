import { api } from "@/utils/api";
import {
  Button,
  Dialog,
  Group,
  NumberInput,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

type BudgetDialogProps = {
  budget: { amount: number; id: string } | null | undefined;
};

function BudgetDialog({ budget }: BudgetDialogProps) {
  const [opened, { close }] = useDisclosure(true);
  const form = useForm<{ amount: number }>({
    initialValues: { amount: 0 },
    validate: {
      amount: (value) => (value > 0 ? null : "Amount must be greater than 0"),
    },
  });

  const setBudget = api.budget.add.useMutation({
    onSuccess: () => {
      form.reset();
      alert("Today's budget set!");
    },
  });

  const clearBudget = api.budget.delete.useMutation({
    onSuccess: () => {
      alert("Today's budget cleared!");
    },
  });

  const handleSubmit = (
    values: { amount: number },
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setBudget.mutate(values);
  };

  if (budget) {
    return (
      <Group position="left">
        <Text>
          {`Today's`} budget is €{budget.amount}
        </Text>
        <Button
          color="red"
          variant="light"
          onClick={() => clearBudget.mutate(budget.id)}
        >
          Clear
        </Button>
      </Group>
    );
  }

  return (
    <>
      <Dialog
        opened={opened}
        withCloseButton
        onClose={close}
        size="lg"
        position={{ bottom: rem(20), right: rem(20) }}
        radius="sm"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Text size="md" weight={500}>
            {`Today's budget?`}
          </Text>
          <Text size="sm" color="gray">
            Setting a goal helps you spend less
          </Text>

          <Stack mt="md">
            <NumberInput {...form.getInputProps("amount")} min={0} autoFocus />
            <Button type="submit" variant="outline" onClick={close}>
              {`Set today's budget`}
            </Button>
          </Stack>
        </form>
      </Dialog>
    </>
  );
}

export default function TodaysBudget() {
  const { data: budget, isLoading } = api.budget.todaysBudget.useQuery();

  if (isLoading) return null;

  return (
    <div>
      <BudgetDialog budget={budget} />
    </div>
  );
}
