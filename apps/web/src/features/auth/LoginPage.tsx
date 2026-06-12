import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  Text,
  Alert,
  Box,
  Group,
  Badge,
  Divider,
} from '@mantine/core';
import { loginSchema } from '@sdui/shared';
import { z } from 'zod';
import { useLoginMutation } from '@/store/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/userSlice';
import classes from './LoginPage.module.css';

type LoginForm = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@example.com', password: 'admin123' },
  { role: 'Manager', email: 'manager@example.com', password: 'manager123' },
  { role: 'Viewer', email: 'viewer@example.com', password: 'viewer123' },
];

export const LoginPage = memo(function LoginPage() {
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@example.com', password: 'admin123' },
  });

  const onSubmit = useCallback(
    async (data: LoginForm) => {
      try {
        const result = await login(data).unwrap();
        dispatch(setCredentials(result));
      } catch {
        // RTK Query handles error state
      }
    },
    [login, dispatch],
  );

  const fillDemo = useCallback(
    (email: string, password: string) => {
      setValue('email', email);
      setValue('password', password);
    },
    [setValue],
  );

  return (
    <Box className={classes.page}>
      <Box className={classes.container}>
        <Box className={classes.hero}>
          <Text className="sdui-label" mb="sm">
            Platform
          </Text>
          <Title order={1} className={classes.heroTitle}>
            Server Driven UI
          </Title>
          <Text className={classes.heroSubtitle}>
            Backend-defined pages rendered at runtime. Ship UI changes from the API — not the frontend.
          </Text>
          <Divider my="xl" color="var(--mantine-color-gray-3)" />
          <Text className="sdui-caption">
            Role-based filtering · dynamic forms · live schema inspector
          </Text>
        </Box>

        <Paper className={classes.formCard} p="xl" radius="md" withBorder shadow="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <div>
                <Title order={3} size="h4">
                  Sign in
                </Title>
                <Text className="sdui-caption" mt={4}>
                  Demo credentials below
                </Text>
              </div>
              {error && (
                <Alert color="red" role="alert" variant="light">
                  Invalid email or password
                </Alert>
              )}
              <TextInput
                label="Email"
                placeholder="admin@example.com"
                error={errors.email?.message}
                aria-label="Email address"
                {...register('email')}
              />
              <PasswordInput
                label="Password"
                error={errors.password?.message}
                aria-label="Password"
                {...register('password')}
              />
              <Button type="submit" fullWidth loading={isLoading}>
                Continue
              </Button>
              <Divider label="Demo accounts" labelPosition="center" />
              <Stack gap="xs">
                {DEMO_ACCOUNTS.map((acc) => (
                  <Paper
                    key={acc.role}
                    p="sm"
                    radius="sm"
                    withBorder
                    className={classes.demoAccount}
                    onClick={() => fillDemo(acc.email, acc.password)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && fillDemo(acc.email, acc.password)}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Text size="sm" c="dimmed">
                        {acc.email}
                      </Text>
                      <Badge variant="outline" color="gray">
                        {acc.role}
                      </Badge>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  );
});
