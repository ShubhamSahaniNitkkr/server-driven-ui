import { memo } from 'react';
import { Paper, Text, Group, Box } from '@mantine/core';
import classes from './SduiFlowBanner.module.css';

const STEPS = [
  { label: 'API schema', detail: 'JSON defines the page structure' },
  { label: 'Role filter', detail: 'Server trims by JWT permissions' },
  { label: 'Live render', detail: 'Click nodes to inspect mapping' },
];

export const SduiFlowBanner = memo(function SduiFlowBanner() {
  return (
    <Paper className={classes.banner} p="md" radius="md" withBorder shadow="xs">
      <Group className={classes.inner} gap="xl" wrap="wrap">
        {STEPS.map((step, i) => (
          <Group key={step.label} gap="sm" wrap="nowrap" className={classes.step}>
            <Text className={classes.stepNum}>{i + 1}</Text>
            <Box miw={0}>
              <Text size="sm" fw={500} lh={1.3}>
                {step.label}
              </Text>
              <Text className="sdui-caption">{step.detail}</Text>
            </Box>
          </Group>
        ))}
      </Group>
    </Paper>
  );
});
