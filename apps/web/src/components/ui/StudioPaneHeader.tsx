import { memo, type ReactNode } from 'react';
import { Group, Text, ThemeIcon, Box } from '@mantine/core';
import classes from './StudioPaneHeader.module.css';

interface StudioPaneHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export const StudioPaneHeader = memo(function StudioPaneHeader({
  icon,
  title,
  subtitle,
}: StudioPaneHeaderProps) {
  return (
    <Box className={classes.header}>
      <Group gap="sm" wrap="nowrap" align="flex-start">
        <ThemeIcon size={32} radius="md" variant="light" color="gray" className={classes.icon}>
          {icon}
        </ThemeIcon>
        <Box miw={0}>
          <Text className="sdui-label">{title}</Text>
          <Text size="sm" fw={500} mt={4} lh={1.35}>
            {subtitle}
          </Text>
        </Box>
      </Group>
    </Box>
  );
});
