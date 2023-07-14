import { api } from "@/utils/api";
import { Flex, Text, Timeline } from "@mantine/core";
import { IconGitBranch } from "@tabler/icons-react";

export default function AddExpenseForm() {
  const { data: expenses } = api.expense.list.useQuery();

  return (
    <Flex
      mih={50}
      gap="md"
      justify="flex-start"
      align="center"
      direction="column"
      wrap="wrap"
    >
      <Timeline active={1} bulletSize={24} lineWidth={2}>
        {expenses?.map((expense) => (
          <Timeline.Item
            key={expense.id}
            bullet={<IconGitBranch size={12} />}
            title={expense.amount}
          >
            <Text color="dimmed" size="sm">
              {expense.description || "No description"}
            </Text>
            <Text size="xs" mt={4}>
              {new Date(expense.createdAt).toLocaleString()}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </Flex>
  );
}
