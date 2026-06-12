import { memo, useCallback, useMemo, useState } from 'react';
import {
  Table,
  TextInput,
  Pagination,
  Group,
  Text,
  Badge,
  Stack,
  Paper,
  Box,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TableSchema } from '@sdui/shared';
import { useGetDataQuery } from '@/store/api/dataApi';
import type { RegisteredComponentProps } from '@/core/registry/types';

function formatCell(value: unknown, render?: string): React.ReactNode {
  if (value === null || value === undefined) return '—';
  switch (render) {
    case 'badge':
      return <Badge variant="light" color="gray">{String(value)}</Badge>;
    case 'currency':
      return `$${Number(value).toLocaleString()}`;
    case 'date':
      return new Date(String(value)).toLocaleDateString();
    default:
      return String(value);
  }
}

export const DataTable = memo(function DataTable({ schema }: RegisteredComponentProps) {
  const tableSchema = schema as TableSchema;
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string | undefined>();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');

  const pageSize = tableSchema.pagination?.pageSize ?? 10;

  const { data, isLoading, error } = useGetDataQuery({
    endpoint: tableSchema.dataSource,
    params: { page, pageSize, sort, order, filter: filter || undefined },
  });

  const handleSort = useCallback(
    (accessor: string) => {
      if (sort === accessor) setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
      else {
        setSort(accessor);
        setOrder('asc');
      }
    },
    [sort],
  );

  const totalPages = useMemo(
    () => Math.ceil((data?.meta.total ?? 0) / pageSize),
    [data?.meta.total, pageSize],
  );

  if (error) {
    return (
      <Paper p="md" withBorder>
        <Text c="red" size="sm">Failed to load table data</Text>
      </Paper>
    );
  }

  return (
    <Stack gap="sm">
      {tableSchema.title && <Text fw={600} size="sm">{tableSchema.title}</Text>}
      {tableSchema.filterable && (
        <TextInput
          placeholder="Filter..."
          leftSection={<IconSearch size={16} />}
          value={filter}
          onChange={(e) => {
            setFilter(e.currentTarget.value);
            setPage(1);
          }}
          aria-label="Filter table"
          style={{ maxWidth: 320 }}
        />
      )}
      <Box style={{ overflowX: 'auto' }}>
        <Table
          striped
          highlightOnHover
          withTableBorder
          miw={500}
          aria-label={tableSchema.meta?.ariaLabel ?? tableSchema.title ?? 'Data table'}
          data-testid={tableSchema.meta?.testId}
        >
          <Table.Thead>
            <Table.Tr>
              {tableSchema.columns.map((col) => (
                <Table.Th
                  key={col.id}
                  style={{ width: col.width, cursor: col.sortable ? 'pointer' : undefined }}
                  onClick={col.sortable ? () => handleSort(col.accessor) : undefined}
                >
                  {col.header}
                  {sort === col.accessor && (order === 'asc' ? ' ↑' : ' ↓')}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={tableSchema.columns.length}>Loading...</Table.Td>
              </Table.Tr>
            ) : (
              data?.data.map((row, idx) => (
                <Table.Tr key={(row.id as string) ?? idx}>
                  {tableSchema.columns.map((col) => (
                    <Table.Td key={col.id}>{formatCell(row[col.accessor], col.render)}</Table.Td>
                  ))}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>
      {totalPages > 1 && (
        <Group justify="center">
          <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
        </Group>
      )}
    </Stack>
  );
});
