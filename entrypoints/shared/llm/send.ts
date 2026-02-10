import OpenAI from 'openai';
import Groq from 'groq-sdk';
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import Anthropic from '@anthropic-ai/sdk';
import MistralClient from '@mistralai/mistralai';
import { GoogleGenAI } from '@google/genai';
import type { ProviderConfig } from './types';
import type { ToolDefinition, ToolCall } from './tools';

export type LlmMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
};

export type LlmResult = {
  text: string;
  toolCalls?: ToolCall[];
};

type SendOptions = {
  provider: ProviderConfig;
  messages: LlmMessage[];
  tools?: ToolDefinition[];
  modelId?: string;
};

const openAiLikeProviders = new Set(['openai', 'groq', 'cerebras']);

export function supportsStreaming(providerId: string): boolean {
  return openAiLikeProviders.has(providerId);
}

export async function sendChat({ provider, messages, tools, modelId }: SendOptions): Promise<LlmResult> {
  const model = modelId ?? provider.defaultModelId ?? provider.models[0]?.id;
  if (!model) throw new Error('No model configured.');

  if (openAiLikeProviders.has(provider.id)) {
    const client =
      provider.id === 'openai'
        ? new OpenAI({ apiKey: provider.apiKey, dangerouslyAllowBrowser: true })
        : provider.id === 'groq'
          ? new Groq({ apiKey: provider.apiKey, dangerouslyAllowBrowser: true })
          : new Cerebras({ apiKey: provider.apiKey });

    const resp = await (client as any).chat.completions.create({
      model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        tool_call_id: m.tool_call_id,
        tool_calls: m.tool_calls
          ? m.tool_calls.map((c) => ({
            id: c.id,
            type: 'function',
            function: { name: c.name, arguments: c.arguments },
          }))
          : undefined,
      })),
      tools: tools?.length ? tools : undefined,
      tool_choice: tools?.length ? 'auto' : 'none',
    });

    const msg = resp.choices?.[0]?.message;
    const toolCalls = msg?.tool_calls?.map((c: any) => ({
      id: c.id,
      name: c.function?.name,
      arguments: c.function?.arguments,
    }));
    return {
      text: msg?.content ?? '',
      toolCalls: toolCalls?.length ? toolCalls : undefined,
    };
  }

  if (provider.id === 'anthropic') {
    const client = new Anthropic({ apiKey: provider.apiKey, dangerouslyAllowBrowser: true });
    const system = messages.find((m) => m.role === 'system')?.content;
    const rest = messages.filter((m) => m.role !== 'system' && m.role !== 'tool');
    const resp = await client.messages.create({
      model,
      max_tokens: 512,
      system,
      messages: rest.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    });
    const text = resp.content?.[0]?.text ?? '';
    return { text };
  }

  if (provider.id === 'google') {
    const client = new GoogleGenAI({ apiKey: provider.apiKey });
    const resp = await client.models.generateContent({
      model,
      contents: messages
        .filter((m) => m.role !== 'tool')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
    });
    const text =
      (resp as any)?.text ??
      (resp as any)?.response?.text ??
      (resp as any)?.candidates?.[0]?.content?.parts?.[0]?.text ??
      '';
    return { text };
  }

  if (provider.id === 'mistral') {
    const client = new MistralClient(provider.apiKey);
    const resp = await (client as any).chat.complete({
      model,
      messages: messages
        .filter((m) => m.role !== 'tool')
        .map((m) => ({ role: m.role, content: m.content })),
    });
    const text = resp?.choices?.[0]?.message?.content ?? '';
    return { text };
  }

  return { text: 'Provider not supported yet.' };
}

export async function *sendChatStream({ provider, messages, modelId }: SendOptions): AsyncIterable<string> {
  const model = modelId ?? provider.defaultModelId ?? provider.models[0]?.id;
  if (!model) throw new Error('No model configured.');
  if (!openAiLikeProviders.has(provider.id)) {
    throw new Error('Streaming not supported for provider.');
  }

  const client =
    provider.id === 'openai'
      ? new OpenAI({ apiKey: provider.apiKey, dangerouslyAllowBrowser: true })
      : provider.id === 'groq'
        ? new Groq({ apiKey: provider.apiKey, dangerouslyAllowBrowser: true })
        : new Cerebras({ apiKey: provider.apiKey });

  const stream = await (client as any).chat.completions.create({
    model,
    stream: true,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  for await (const chunk of stream) {
    const delta = chunk?.choices?.[0]?.delta;
    const content = delta?.content;
    if (content) yield content;
  }
}

function stripCodeFences(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return text.trim();
}

function findJsonBlock(text: string): string | null {
  const start = text.indexOf('{');
  if (start === -1) return null;
  const end = text.lastIndexOf('}');
  if (end === -1 || end <= start) return null;
  return text.slice(start, end + 1).trim();
}

export function extractToolCallsFromText(text: string): { toolCalls?: ToolCall[]; cleanedText: string; parseError?: string } {
  const candidate = stripCodeFences(text);
  const jsonBlock = findJsonBlock(candidate);
  if (!jsonBlock || !jsonBlock.includes('"tool_calls"')) {
    return { cleanedText: text };
  }
  try {
    const parsed = JSON.parse(jsonBlock);
    const toolCalls = Array.isArray(parsed.tool_calls) ? parsed.tool_calls : undefined;
    if (!toolCalls) return { cleanedText: text };
    return { toolCalls, cleanedText: '' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { cleanedText: text, parseError: message };
  }
}
