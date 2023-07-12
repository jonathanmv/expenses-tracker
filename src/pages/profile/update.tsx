import { api } from "@/utils/api";
import { Button, Center, Container, Paper, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useEffect } from "react";

type UpdateProfileFormValues = {
  name: string;
};

export default function UpdateProfiles() {
  const { data: profile } = api.user.getProfile.useQuery();
  const updateProfile = api.user.setProfile.useMutation({
    onSuccess: () => {
      alert("Profile updated");
    },
  });

  const form = useForm<UpdateProfileFormValues>({
    initialValues: { name: profile?.name || "" },
    validate: {
      name: (value) =>
        value && value.length > 1 && value.length < 21
          ? null
          : "Please enter a name",
    },
  });

  const { setValues } = form;
  useEffect(() => {
    if (profile && profile.name) {
      setValues({ name: profile.name });
    }
  }, [profile, setValues]);

  const handleSubmit = (
    values: UpdateProfileFormValues,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    updateProfile.mutate(values);
  };

  return (
    <Center maw={400} h="100%" mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper shadow="xs" p="lg" w="100%">
          <TextInput label="Email" disabled value={profile?.email || ""} />
          <TextInput
            label="How should we call you?"
            description="(optional) minimum 2 characters, maximum 20 characters"
            {...form.getInputProps("name")}
            autoFocus
          />
          <Container mt="md" />
          <Button type="submit" variant="outline" fullWidth>
            Update profile
          </Button>
          <Link href="/">
            <Button type="submit" variant="white" color="gray" fullWidth>
              Go Home
            </Button>
          </Link>
        </Paper>
      </form>
    </Center>
  );
}
