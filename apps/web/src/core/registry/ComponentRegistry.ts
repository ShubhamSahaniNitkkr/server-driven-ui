import type { ComponentType } from 'react';
import type { RegistryEntry, RegisteredComponentProps, FallbackEntry } from './types';

class ComponentRegistryClass {
  private registry = new Map<string, RegistryEntry>();
  private fallback: ComponentType<RegisteredComponentProps> | null = null;

  register(type: string, entry: RegistryEntry): void {
    this.registry.set(type, entry);
  }

  setFallback(component: ComponentType<RegisteredComponentProps>): void {
    this.fallback = component;
  }

  resolve(type: string): RegistryEntry | FallbackEntry {
    const entry = this.registry.get(type);
    if (entry) return entry;

    if (this.fallback) {
      return { component: this.fallback, isFallback: true };
    }

    throw new Error(`No component registered for type: ${type}`);
  }

  has(type: string): boolean {
    return this.registry.has(type);
  }

  list(): string[] {
    return Array.from(this.registry.keys());
  }

  getByCategory(category: RegistryEntry['category']): string[] {
    return Array.from(this.registry.entries())
      .filter(([, entry]) => entry.category === category)
      .map(([type]) => type);
  }
}

export const ComponentRegistry = new ComponentRegistryClass();
