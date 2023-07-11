import {
  Button,
  Center,
  Container,
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
    initialValues: { amount: 0 },
    validate: {
      amount: (value) => (value > 0 ? null : "Amount must be greater than 0"),
    },
  });

  const handleSubmit = (
    values: AddExpenseFormValues,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log(values);
  };

  return (
    <Center maw={400} h="100%" mx="auto">
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
    </Center>
  );
}
