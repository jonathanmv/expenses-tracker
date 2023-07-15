import { api } from "@/utils/api";
import {
  Button,
  Space,
  Stack,
  Switch,
  TextInput,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

type UpdateProfileFormValues = {
  name: string;
};

export default function Profile() {
  return (
    <Stack justify="flex-start" spacing="xl">
      <UpdateProfile />
      <ChangeColorScheme />
      <SignOut />
    </Stack>
  );
}

function SignOut() {
  return (
    <Stack spacing="lg">
      <Title>Sign out</Title>
      <Button
        variant="outline"
        fullWidth
        onClick={() => void signOut({ callbackUrl: "/" })}
      >
        Sign out
      </Button>
    </Stack>
  );
}

function UpdateProfile() {
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
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="lg">
        <Title>Profile</Title>
        <TextInput label="Email" disabled value={profile?.email || ""} />
        <TextInput
          label="How should we call you?"
          description="(optional) minimum 2 characters, maximum 20 characters"
          {...form.getInputProps("name")}
          autoFocus
        />
        <Space />
        <Button type="submit" variant="outline" fullWidth>
          Update profile
        </Button>
      </Stack>
    </form>
  );
}

function ChangeColorScheme() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  return (
    <Stack spacing="lg">
      <Title>Settings</Title>
      <Switch
        size="md"
        color={colorScheme === "dark" ? "gray" : "dark"}
        onLabel={
          <IconSun size="1rem" stroke={2.5} color={theme.colors.yellow[4]} />
        }
        label={colorScheme === "dark" ? "Dark Mode" : "Light Mode"}
        onChange={() => toggleColorScheme()}
        offLabel={<IconMoonStars size="1rem" color={theme.colors.blue[6]} />}
      />
    </Stack>
  );
}
