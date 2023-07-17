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

type EditExpenseProps = {
  expense: EditExpenseFormValues;
  onEdit: (values: EditExpenseFormValues) => void;
  onDelete: (id: string) => void;
};
function stringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return value;
}

export default function EditExpense() {
  const router = useRouter();
  const editExpense = api.expense.update.useMutation({
    onSuccess: () => {
      alert("Expense edited!");
    },
  });

  const deleteExpense = api.expense.delete.useMutation({
    onSuccess: () => {
      alert("Expense deleted!");
      void router.push("/");
    },
  });

  const { data: expense } = api.expense.get.useQuery(
    stringOrNull(router.query.id) || "",
    {
      enabled: !!router.query.id,
    }
  );
  if (!expense) return null;

  return (
    <Stack spacing="xl" justify="flex-start">
      <EditExpenseForm
        expense={expense}
        onEdit={(expense) =>
          editExpense.mutate({
            id: expense.id,
            amount: expense.amount,
            description: expense.description || undefined,
          })
        }
        onDelete={(id) => deleteExpense.mutate(id)}
      />
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

const EditExpenseForm: React.FC<EditExpenseProps> = ({
  expense,
  onEdit,
  onDelete,
}) => {
  const form = useForm<EditExpenseFormValues>({
    initialValues: expense,
    validate: {
      amount: (value) => (value > 0 ? null : "Amount must be greater than 0"),
    },
  });

  const handleSubmit = (
    values: EditExpenseFormValues,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    onEdit({
      id: values.id,
      amount: values.amount,
      description: values.description || undefined,
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this expense?")) {
      onDelete(expense.id);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="lg">
        <div className="flex flex-row justify-between">
          <Title>Edit Expense</Title>
          <Button onClick={handleDelete} variant="outline" color="red">
            Delete
          </Button>
        </div>
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
