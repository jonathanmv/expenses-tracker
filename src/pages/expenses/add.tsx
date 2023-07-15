import { api } from "@/utils/api";
import {
  Button,
  NumberInput,
  Space,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";

type AddExpenseFormValues = {
  amount: number;
  description?: string;
};

export default function AddExpense() {
  return (
    <Stack spacing="xl" justify="flex-start">
      <AddExpenseForm />
      <CancelButton />
    </Stack>
  );
}

function CancelButton() {
  return (
    <Link href="/">
      <Button variant="light" fullWidth>
        Cancel
      </Button>
    </Link>
  );
}

function AddExpenseForm() {
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
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="lg">
        <Title>Add Expense</Title>
        <NumberInput
          label="Amount spent"
          {...form.getInputProps("amount")}
          min={0}
          precision={2}
          autoFocus
        />
        <TextInput
          label="Description"
          description="(optional) e.g. Groceries"
          placeholder="e.g. Groceries"
          {...form.getInputProps("description")}
        />
        <Space />
        <Button type="submit" variant="outline" fullWidth>
          Add Expense
        </Button>
      </Stack>
    </form>
  );
}
