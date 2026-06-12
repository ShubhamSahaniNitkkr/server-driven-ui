import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Badge, Box, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import classes from './JsonTreeViewer.module.css';

interface JsonTreeViewerProps {
  data: unknown;
  selectedId: string | null;
  onSelectId: (id: string) => void;
  scrollToId?: string | null;
}

function isSchemaObject(value: unknown): value is { id: string; type: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'type' in value &&
    typeof (value as { id: unknown }).id === 'string' &&
    typeof (value as { type: unknown }).type === 'string'
  );
}

interface TreeNodeProps {
  name?: string;
  value: unknown;
  depth: number;
  selectedId: string | null;
  onSelectId: (id: string) => void;
  scrollToId?: string | null;
  defaultExpanded?: boolean;
}

const TreeNode = memo(function TreeNode({
  name,
  value,
  depth,
  selectedId,
  onSelectId,
  scrollToId,
  defaultExpanded = depth < 2,
}: TreeNodeProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isSchema = isSchemaObject(value);
  const isSelected = isSchema && selectedId === value.id;

  useEffect(() => {
    if (isSchema && isSelected && scrollToId === value.id && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected, scrollToId, value, isSchema]);

  const toggle = useCallback(() => setExpanded((e) => !e), []);

  if (value === null || value === undefined) {
    return (
      <div className={classes.line} style={{ paddingLeft: depth * 14 }}>
        {name && <span className={classes.key}>{name}: </span>}
        <span className={classes.null}>null</span>
      </div>
    );
  }

  if (typeof value !== 'object') {
    return (
      <div className={classes.line} style={{ paddingLeft: depth * 14 }}>
        {name && <span className={classes.key}>{name}: </span>}
        <span className={classes.primitive}>{JSON.stringify(value)}</span>
      </div>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <div className={classes.line} style={{ paddingLeft: depth * 14 }}>
          {name && <span className={classes.key}>{name}: </span>}
          <span className={classes.bracket}>[]</span>
        </div>
      );
    }
    return (
      <div>
        <UnstyledButton className={classes.toggle} onClick={toggle} style={{ paddingLeft: depth * 14 }}>
          {expanded ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
          {name && <span className={classes.key}>{name}: </span>}
          <span className={classes.bracket}>[{value.length}]</span>
        </UnstyledButton>
        {expanded &&
          value.map((item, i) => (
            <TreeNode
              key={isSchemaObject(item) ? item.id : `${depth}-${i}`}
              name={String(i)}
              value={item}
              depth={depth + 1}
              selectedId={selectedId}
              onSelectId={onSelectId}
              scrollToId={scrollToId}
              defaultExpanded={depth < 1}
            />
          ))}
      </div>
    );
  }

  const entries = Object.entries(value as Record<string, unknown>);

  if (isSchema) {
    return (
      <div>
        <div
          ref={rowRef}
          className={`${classes.schemaRow} ${isSelected ? classes.selected : ''}`}
          style={{ paddingLeft: depth * 14 }}
          onClick={() => onSelectId(value.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectId(value.id);
            }
          }}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected}
        >
          <UnstyledButton
            className={classes.chevronBtn}
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
          </UnstyledButton>
          <Badge size="xs" variant="outline" color="gray" className={classes.typeBadge}>
            {value.type}
          </Badge>
          <Text span className={classes.nodeId}>
            {value.id}
          </Text>
        </div>
        {expanded &&
          entries
            .filter(([k]) => k !== 'id' && k !== 'type')
            .map(([k, v]) => (
              <TreeNode
                key={k}
                name={k}
                value={v}
                depth={depth + 1}
                selectedId={selectedId}
                onSelectId={onSelectId}
                scrollToId={scrollToId}
                defaultExpanded={k === 'children' || k === 'widgets' || k === 'layout'}
              />
            ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className={classes.line} style={{ paddingLeft: depth * 14 }}>
        {name && <span className={classes.key}>{name}: </span>}
        <span className={classes.bracket}>{'{}'}</span>
      </div>
    );
  }

  return (
    <div>
      <UnstyledButton className={classes.toggle} onClick={toggle} style={{ paddingLeft: depth * 14 }}>
        {expanded ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
        {name && <span className={classes.key}>{name}: </span>}
        <span className={classes.bracket}>{'{'}</span>
      </UnstyledButton>
      {expanded && (
        <>
          {entries.map(([k, v]) => (
            <TreeNode
              key={k}
              name={k}
              value={v}
              depth={depth + 1}
              selectedId={selectedId}
              onSelectId={onSelectId}
              scrollToId={scrollToId}
              defaultExpanded={k === 'layout' || k === 'children'}
            />
          ))}
          <div className={classes.line} style={{ paddingLeft: depth * 14 }}>
            <span className={classes.bracket}>{'}'}</span>
          </div>
        </>
      )}
    </div>
  );
});

export const JsonTreeViewer = memo(function JsonTreeViewer(props: JsonTreeViewerProps) {
  return (
    <Box className={classes.root}>
      <TreeNode value={props.data} depth={0} defaultExpanded {...props} />
    </Box>
  );
});
