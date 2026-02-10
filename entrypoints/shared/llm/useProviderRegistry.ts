import { useEffect, useMemo, useState } from 'react';
import { storage } from '#imports';
import { providerCatalog } from './catalog';
import type { ProviderConfig, ProviderRegistry } from './types';
import { loadProviderRegistry, saveProviderRegistry, PROVIDER_STORAGE_KEY } from './storage';

type UseProviderRegistry = {
  registry: ProviderRegistry;
  enabledProviders: ProviderConfig[];
  setRegistry: (next: ProviderRegistry) => void;
  addProvider: (id: string) => void;
  removeProvider: (id: string) => void;
  updateProvider: (id: string, patch: Partial<ProviderConfig>) => void;
  setDefaultModel: (providerId: string, modelId: string) => void;
  setGlobalDefault: (providerId: string, modelId: string) => void;
};

export function useProviderRegistry(): UseProviderRegistry {
  const [registry, setRegistryState] = useState<ProviderRegistry>({ providers: [] });

  useEffect(() => {
    void (async () => {
      const stored = await loadProviderRegistry();
      setRegistryState(stored);
    })();
  }, []);

  useEffect(() => {
    const unwatch = storage.watch<ProviderRegistry>(`local:${PROVIDER_STORAGE_KEY}`, (next) => {
      if (next) setRegistryState(next);
    });
    return () => unwatch();
  }, []);

  const enabledProviders = useMemo(
    () => registry.providers.filter(p => p.enabled),
    [registry.providers],
  );

  const setRegistry = (next: ProviderRegistry) => {
    setRegistryState(next);
    void saveProviderRegistry(next);
  };

  const addProvider = (id: string) => {
    const catalog = providerCatalog.find(p => p.id === id);
    if (!catalog) return;
    const existing = registry.providers.find(p => p.id === id);
    if (existing) return;
    const nextProvider: ProviderConfig = {
      id: catalog.id,
      name: catalog.name,
      apiKey: '',
      enabled: true,
      models: catalog.models,
      defaultModelId: catalog.models[0]?.id,
    };
    const next: ProviderRegistry = {
      ...registry,
      providers: [...registry.providers, nextProvider],
      defaultProviderId: registry.defaultProviderId ?? catalog.id,
      defaultModelId: registry.defaultModelId ?? catalog.models[0]?.id,
    };
    setRegistry(next);
  };

  const removeProvider = (id: string) => {
    const providers = registry.providers.filter(p => p.id !== id);
    const isDefaultProvider = registry.defaultProviderId === id;
    const nextDefaultProvider = isDefaultProvider ? providers[0]?.id : registry.defaultProviderId;
    const nextDefaultModel =
      isDefaultProvider
        ? providers[0]?.defaultModelId
        : registry.defaultModelId;
    setRegistry({
      ...registry,
      providers,
      defaultProviderId: nextDefaultProvider,
      defaultModelId: nextDefaultModel,
    });
  };

  const updateProvider = (id: string, patch: Partial<ProviderConfig>) => {
    const providers = registry.providers.map(p => (p.id === id ? { ...p, ...patch } : p));
    setRegistry({ ...registry, providers });
  };

  const setDefaultModel = (providerId: string, modelId: string) => {
    const providers = registry.providers.map(p => (p.id === providerId ? { ...p, defaultModelId: modelId } : p));
    setRegistry({ ...registry, providers });
  };

  const setGlobalDefault = (providerId: string, modelId: string) => {
    setRegistry({ ...registry, defaultProviderId: providerId, defaultModelId: modelId });
  };

  return {
    registry,
    enabledProviders,
    setRegistry,
    addProvider,
    removeProvider,
    updateProvider,
    setDefaultModel,
    setGlobalDefault,
  };
}
