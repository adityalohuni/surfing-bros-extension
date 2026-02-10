import type { ModelSpec, ProviderConfig } from './types';

export type LlmMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type LlmRequest = {
  providerId: string;
  modelId: string;
  messages: LlmMessage[];
  tools?: any[];
  toolChoice?: 'auto' | 'none';
};

export type LlmChunk = {
  type: 'text' | 'tool_call' | 'tool_result' | 'done';
  content?: string;
  data?: any;
};

export type LlmResponse = {
  text: string;
  toolCalls?: any[];
};

export type LlmProvider = {
  id: string;
  name: string;
  models: ModelSpec[];
  send: (request: LlmRequest) => Promise<LlmResponse>;
  stream?: (request: LlmRequest) => AsyncIterable<LlmChunk>;
};

export type LlmRouterOptions = {
  providers: LlmProvider[];
};

export class LlmRouter {
  private providers: Map<string, LlmProvider>;

  constructor(opts: LlmRouterOptions) {
    this.providers = new Map(opts.providers.map(p => [p.id, p]));
  }

  getProvider(id: string): LlmProvider | undefined {
    return this.providers.get(id);
  }

  resolveModel(providerId: string, modelId: string): { provider?: LlmProvider; model?: ModelSpec } {
    const provider = this.providers.get(providerId);
    const model = provider?.models.find(m => m.id === modelId);
    return { provider, model };
  }

  async send(request: LlmRequest): Promise<LlmResponse> {
    const provider = this.providers.get(request.providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${request.providerId}`);
    }
    return provider.send(request);
  }
}

export function buildProviderFromConfig(config: ProviderConfig): LlmProvider {
  return {
    id: config.id,
    name: config.name,
    models: config.models,
    async send() {
      throw new Error('Provider not implemented. Add API integration to use this provider.');
    },
  };
}
