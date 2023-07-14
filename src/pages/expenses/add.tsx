import { api } from "@/utils/api";
import {
  Button,
  Container,
  Flex,
  NumberInput,
  Paper,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

type AddExpenseFormValues = {
  amount: number;
  description?: string;
};

export default function AddExpenseForm() {
  const form = useForm<AddExpenseFormValues>({
    initialValues: { amount: 0, description: "" },
    validate: {
      amount: (value) => (value > 0 ? null : "Amount must be greater than 0"),
    },
  });

  const addExpense = api.expense.add.useMutation({
    onSuccess: () => {
      form.reset();
      alert("Expense added!");
    },
  });

  const handleSubmit = (
    values: AddExpenseFormValues,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    addExpense.mutate(values);
  };

  return (
    <Flex
      mih={50}
      gap="md"
      justify="flex-start"
      align="center"
      direction="column"
      wrap="wrap"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper shadow="xs" p="lg" w="100%">
          <NumberInput
            label="Amount spent"
            {...form.getInputProps("amount")}
            min={0}
            precision={2}
          />
          <TextInput
            label="Description"
            description="(optional) e.g. Groceries"
            placeholder="e.g. Groceries"
            {...form.getInputProps("description")}
          />
          <Container mt="md" />
          <Button type="submit" variant="light" fullWidth>
            Add expense
          </Button>
        </Paper>
      </form>
    </Flex>
  );
}
