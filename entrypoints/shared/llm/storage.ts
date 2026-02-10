import { storage } from '#imports';
import type { ProviderRegistry, ProviderConfig } from './types';

export const PROVIDER_STORAGE_KEY = 'surfingbro_providers_v1';

export async function loadProviderRegistry(): Promise<ProviderRegistry> {
  const stored = await storage.getItem<ProviderRegistry>(`local:${PROVIDER_STORAGE_KEY}`);
  return stored ?? { providers: [] };
}

export async function saveProviderRegistry(registry: ProviderRegistry): Promise<void> {
  await storage.setItem(`local:${PROVIDER_STORAGE_KEY}`, registry);
}

export function withProvider(registry: ProviderRegistry, next: ProviderConfig): ProviderRegistry {
  const exists = registry.providers.some(p => p.id === next.id);
  const providers = exists
    ? registry.providers.map(p => (p.id === next.id ? next : p))
    : [...registry.providers, next];
  return { ...registry, providers };
}
