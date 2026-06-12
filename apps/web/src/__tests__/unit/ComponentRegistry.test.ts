import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentRegistry } from '@/core/registry/ComponentRegistry';
import { FallbackComponent } from '@/core/renderer/FallbackComponent';

const MockComponent = () => null;

describe('ComponentRegistry', () => {
  beforeEach(() => {
    ComponentRegistry.register('test-component', {
      component: MockComponent,
      category: 'data',
    });
    ComponentRegistry.setFallback(FallbackComponent);
  });

  it('registers and resolves components', () => {
    const entry = ComponentRegistry.resolve('test-component');
    expect(entry.component).toBe(MockComponent);
  });

  it('returns fallback for unknown types', () => {
    const entry = ComponentRegistry.resolve('unknown-type');
    expect('isFallback' in entry).toBe(true);
  });

  it('lists registered types', () => {
    expect(ComponentRegistry.list()).toContain('test-component');
  });

  it('checks if type is registered', () => {
    expect(ComponentRegistry.has('test-component')).toBe(true);
    expect(ComponentRegistry.has('nonexistent')).toBe(false);
  });
});
