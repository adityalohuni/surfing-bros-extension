import type { ProviderCatalogEntry } from './types';

export const providerCatalog: ProviderCatalogEntry[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      { id: 'gpt-4.1', label: 'GPT-4.1', supportsTools: true, supportsVision: true },
      { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini', supportsTools: true, supportsVision: true },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini', supportsTools: true, supportsVision: true },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      { id: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', supportsTools: true, supportsVision: true },
      { id: 'claude-3.5-haiku', label: 'Claude 3.5 Haiku', supportsTools: true, supportsVision: true },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    models: [
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', supportsTools: true, supportsVision: true },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', supportsTools: true, supportsVision: true },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral',
    models: [
      { id: 'mistral-large', label: 'Mistral Large', supportsTools: true, supportsVision: false },
      { id: 'mistral-small', label: 'Mistral Small', supportsTools: true, supportsVision: false },
    ],
  },
  {
    id: 'groq',
    name: 'Groq',
    models: [
      { id: 'llama-3.1-70b', label: 'Llama 3.1 70B', supportsTools: false, supportsVision: false },
      { id: 'llama-3.1-8b', label: 'Llama 3.1 8B', supportsTools: false, supportsVision: false },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    models: [
      { id: 'openrouter/auto', label: 'OpenRouter Auto', supportsTools: true, supportsVision: true },
    ],
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    models: [
      { id: 'llama-3.3-70b', label: 'Llama 3.3 70B', supportsTools: false, supportsVision: false },
      { id: 'llama3.1-8b', label: 'Llama 3.1 8B', supportsTools: false, supportsVision: false },
    ],
  },
];
