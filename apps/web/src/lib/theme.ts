import { createTheme, rem } from '@mantine/core';

/** Enterprise-grade Mantine theme — restrained palette, tight typography */
export const appTheme = createTheme({
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'SF Mono, Fira Code, Consolas, monospace',
  primaryColor: 'blue',
  defaultRadius: 'md',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: rem(26), lineHeight: '1.25', fontWeight: '600' },
      h2: { fontSize: rem(20), lineHeight: '1.3', fontWeight: '600' },
      h3: { fontSize: rem(17), lineHeight: '1.35', fontWeight: '600' },
      h4: { fontSize: rem(15), lineHeight: '1.4', fontWeight: '600' },
      h5: { fontSize: rem(14), lineHeight: '1.45', fontWeight: '600' },
      h6: { fontSize: rem(13), lineHeight: '1.5', fontWeight: '600' },
    },
  },
  fontSizes: {
    xs: rem(11),
    sm: rem(13),
    md: rem(14),
    lg: rem(15),
    xl: rem(17),
  },
  shadows: {
    xs: '0 1px 2px rgba(16, 24, 40, 0.04)',
    sm: '0 1px 3px rgba(16, 24, 40, 0.06)',
    md: '0 4px 12px rgba(16, 24, 40, 0.06)',
    lg: '0 8px 24px rgba(16, 24, 40, 0.08)',
  },
  components: {
    Paper: { defaultProps: { shadow: 'xs', radius: 'md', withBorder: true } },
    Card: { defaultProps: { shadow: 'xs', radius: 'md', withBorder: true } },
    Button: { defaultProps: { radius: 'md', size: 'sm' } },
    Badge: { defaultProps: { radius: 'sm', size: 'sm', variant: 'light' } },
    NavLink: { defaultProps: { radius: 'sm' } },
    Alert: { defaultProps: { radius: 'md', variant: 'light' } },
    Table: {
      defaultProps: {
        striped: true,
        highlightOnHover: true,
        withTableBorder: true,
        fz: 'sm',
      },
    },
    ActionIcon: { defaultProps: { radius: 'sm', variant: 'subtle', color: 'gray' } },
    Menu: { defaultProps: { radius: 'md', shadow: 'md' } },
  },
});
