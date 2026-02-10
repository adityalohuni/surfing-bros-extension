export type ModelSpec = {
  id: string;
  label: string;
  supportsTools: boolean;
  supportsVision: boolean;
};

export type ProviderCatalogEntry = {
  id: string;
  name: string;
  models: ModelSpec[];
};

export type ProviderConfig = {
  id: string;
  name: string;
  apiKey: string;
  enabled: boolean;
  models: ModelSpec[];
  defaultModelId?: string;
};

export type ProviderRegistry = {
  providers: ProviderConfig[];
  defaultProviderId?: string;
  defaultModelId?: string;
};
