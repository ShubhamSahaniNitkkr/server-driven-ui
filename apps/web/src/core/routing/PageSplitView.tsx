import { memo } from 'react';
import { Box } from '@mantine/core';
import { IconCode, IconLayout } from '@tabler/icons-react';
import { SduiFlowBanner } from '@/components/ui/SduiFlowBanner';
import { StudioPaneHeader } from '@/components/ui/StudioPaneHeader';
import { SchemaPanel } from '@/components/studio/SchemaPanel/SchemaPanel';
import { SchemaSelectionProvider } from '@/contexts/SchemaSelectionContext';
import { DynamicPage } from './DynamicPage';
import classes from './PageSplitView.module.css';

interface PageSplitViewProps {
  path: string;
}

export const PageSplitView = memo(function PageSplitView({ path }: PageSplitViewProps) {
  return (
    <SchemaSelectionProvider path={path}>
      <Box className={classes.wrapper}>
        <SduiFlowBanner />
        <Box className={classes.root}>
          <Box className={classes.pane}>
            <StudioPaneHeader
              icon={<IconLayout size={16} stroke={1.5} />}
              title="Preview"
              subtitle="Rendered output from the server schema"
            />
            <Box className={classes.paneBody}>
              <DynamicPage path={path} compact studio />
            </Box>
          </Box>
          <Box className={classes.divider} aria-hidden />
          <Box className={classes.pane}>
            <StudioPaneHeader
              icon={<IconCode size={16} stroke={1.5} />}
              title="Schema"
              subtitle="Select a node to inspect the render path"
            />
            <Box className={classes.paneBody}>
              <SchemaPanel path={path} />
            </Box>
          </Box>
        </Box>
      </Box>
    </SchemaSelectionProvider>
  );
});
