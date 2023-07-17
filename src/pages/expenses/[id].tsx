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
import { useRouter } from "next/router";

type EditExpenseFormValues = {
  id: string;
  amount: number;
  description?: string | null;
};

export default function EditExpense() {
  const router = useRouter();
  if (typeof router.query.id !== "string") return null;
  const { data: expense } = api.expense.get.useQuery(router.query.id);
  if (!expense) return null;

  return (
    <Stack spacing="xl" justify="flex-start">
      <EditExpenseForm expense={expense} />
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

const EditExpenseForm: React.FC<{ expense: EditExpenseFormValues }> = ({
  expense,
}) => {
  const form = useForm<EditExpenseFormValues>({
    initialValues: expense,
    validate: {
      amount: (value) => (value > 0 ? null : "Amount must be greater than 0"),
    },
  });

  const editExpense = api.expense.update.useMutation({
    onSuccess: () => {
      form.reset();
      alert("Expense edited!");
    },
  });

  const handleSubmit = (
    values: EditExpenseFormValues,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    editExpense.mutate({
      id: values.id,
      amount: values.amount,
      description: values.description || undefined,
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="lg">
        <Title>Edit Expense</Title>
        <input type="hidden" {...form.getInputProps("id")} />
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
          Update Expense
        </Button>
      </Stack>
    </form>
  );
};
