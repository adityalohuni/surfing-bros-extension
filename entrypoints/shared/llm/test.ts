import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import MistralClient from '@mistralai/mistralai';
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { GoogleGenAI } from '@google/genai';
import type { ProviderConfig } from './types';

type TestResult = {
  ok: boolean;
  message: string;
};

export async function testProvider(provider: ProviderConfig): Promise<TestResult> {
  if (!provider.apiKey?.trim()) {
    return { ok: false, message: 'Missing API key.' };
  }

  const modelId = provider.defaultModelId ?? provider.models[0]?.id;
  if (!modelId) {
    return { ok: false, message: 'No model configured for provider.' };
  }

  try {
    switch (provider.id) {
      case 'openai': {
        const client = new OpenAI({ apiKey: provider.apiKey, dangerouslyAllowBrowser: true });
        await client.models.list();
        return { ok: true, message: 'Connected to OpenAI.' };
      }
      case 'anthropic': {
        const client = new Anthropic({ apiKey: provider.apiKey, dangerouslyAllowBrowser: true });
        await client.messages.create({
          model: modelId,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Ping' }],
        });
        return { ok: true, message: 'Connected to Anthropic.' };
      }
      case 'google': {
        const client = new GoogleGenAI({ apiKey: provider.apiKey });
        await client.models.generateContent({
          model: modelId,
          contents: 'Ping',
        });
        return { ok: true, message: 'Connected to Google.' };
      }
      case 'mistral': {
        const client = new MistralClient(provider.apiKey);
        await client.listModels();
        return { ok: true, message: 'Connected to Mistral.' };
      }
      case 'groq': {
        const client = new Groq({ apiKey: provider.apiKey, dangerouslyAllowBrowser: true });
        await client.chat.completions.create({
          model: modelId,
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 1,
        });
        return { ok: true, message: 'Connected to Groq.' };
      }
      case 'openrouter': {
        return { ok: false, message: 'OpenRouter SDK not configured yet.' };
      }
      case 'cerebras': {
        const client = new Cerebras({ apiKey: provider.apiKey });
        await client.chat.completions.create({
          model: modelId,
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 1,
        });
        return { ok: true, message: 'Connected to Cerebras.' };
      }
      default:
        return { ok: false, message: 'Provider test not implemented.' };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message: `Network error: ${message}` };
  }
}
