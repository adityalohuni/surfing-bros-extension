type JsonRpcId = number | string;

type JsonRpcSuccess<T> = {
  jsonrpc: '2.0';
  id: JsonRpcId;
  result: T;
};

type JsonRpcFailure = {
  jsonrpc: '2.0';
  id: JsonRpcId | null;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
};

type JsonRpcEnvelope<T> = JsonRpcSuccess<T> | JsonRpcFailure;

type InitializeResult = {
  protocolVersion?: string;
  serverInfo?: {
    name?: string;
    version?: string;
  };
};

export type McpTool = {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
};

export type McpResource = {
  uri: string;
  name?: string;
  description?: string;
  mimeType?: string;
};

export type McpResourceTemplate = {
  uriTemplate: string;
  name?: string;
  description?: string;
  mimeType?: string;
};

export type McpReadResourceResult = {
  contents?: Array<{
    uri?: string;
    mimeType?: string;
    text?: string;
    blob?: string;
  }>;
};

export type McpCallToolResult = {
  content?: Array<{
    type?: string;
    text?: string;
    mimeType?: string;
  }>;
  structuredContent?: unknown;
  isError?: boolean;
};

type McpClientOptions = {
  streamUrl: string;
  token?: string;
  clientName?: string;
  clientVersion?: string;
  clientId?: string;
  mcpSessionId?: string;
  mcpProtocolVersion?: string;
};

function normalizeBaseHeaders(opts: McpClientOptions): HeadersInit {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
  };
  if (opts.token?.trim()) {
    headers.authorization = `Bearer ${opts.token.trim()}`;
  }
  if (opts.clientName?.trim()) {
    headers['x-client-name'] = opts.clientName.trim();
  }
  if (opts.clientId?.trim()) {
    headers['x-client-id'] = opts.clientId.trim();
  }
  if (opts.mcpSessionId?.trim()) {
    headers['mcp-session-id'] = opts.mcpSessionId.trim();
  }
  if (opts.mcpProtocolVersion?.trim()) {
    headers['mcp-protocol-version'] = opts.mcpProtocolVersion.trim();
  }
  return headers;
}

function parseSSEPayload(body: string): unknown[] {
  const parsed: unknown[] = [];
  const chunks = body.split(/\n\n+/g);
  for (const chunk of chunks) {
    const lines = chunk.split('\n');
    const dataLines = lines
      .map((line) => line.trim())
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice('data:'.length).trim())
      .filter(Boolean);
    if (!dataLines.length) continue;
    const payload = dataLines.join('\n');
    try {
      parsed.push(JSON.parse(payload));
    } catch {
      // Ignore non-JSON events.
    }
  }
  return parsed;
}

function parseRpcBody(body: string): unknown[] {
  const trimmed = body.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    // Fall through.
  }

  const sseParsed = parseSSEPayload(trimmed);
  if (sseParsed.length) return sseParsed;

  const lines = trimmed.split('\n').map((line) => line.trim()).filter(Boolean);
  const out: unknown[] = [];
  for (const line of lines) {
    try {
      out.push(JSON.parse(line));
    } catch {
      // Ignore non-JSON lines.
    }
  }
  return out;
}

function isRpcEnvelope(value: unknown): value is JsonRpcEnvelope<unknown> {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return v.jsonrpc === '2.0' && ('result' in v || 'error' in v);
}

function envelopeError(error: { code: number; message: string; data?: unknown }): Error {
  const detail = error.data ? ` (${JSON.stringify(error.data)})` : '';
  return new Error(`MCP error ${error.code}: ${error.message}${detail}`);
}

export class McpStreamClient {
  private opts: McpClientOptions;
  private requestId = 1;
  private initialized = false;
  private server: InitializeResult | null = null;

  constructor(options: McpClientOptions) {
    this.opts = { ...options };
  }

  getAssignedClientId(): string | undefined {
    return this.opts.clientId?.trim() || undefined;
  }

  getInitializeResult(): InitializeResult | null {
    return this.server;
  }

  private async rpc<T = unknown>(method: string, params?: unknown, notification = false): Promise<T> {
    const id = this.requestId++;
    const payload: Record<string, unknown> = {
      jsonrpc: '2.0',
      method,
    };
    if (!notification) payload.id = id;
    if (typeof params !== 'undefined') payload.params = params;

    const res = await fetch(this.opts.streamUrl, {
      method: 'POST',
      headers: normalizeBaseHeaders(this.opts),
      body: JSON.stringify(payload),
    });
    const assigned = res.headers.get('x-assigned-client-id');
    if (assigned?.trim()) {
      this.opts.clientId = assigned.trim();
    }
    const sessionId = res.headers.get('mcp-session-id');
    if (sessionId?.trim()) {
      this.opts.mcpSessionId = sessionId.trim();
    }
    const protocolVersion = res.headers.get('mcp-protocol-version');
    if (protocolVersion?.trim()) {
      this.opts.mcpProtocolVersion = protocolVersion.trim();
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`MCP HTTP ${res.status}: ${body || res.statusText}`);
    }
    if (notification) return undefined as T;

    const body = await res.text();
    const envelopes = parseRpcBody(body).filter(isRpcEnvelope);
    if (!envelopes.length) {
      throw new Error('Invalid MCP response payload');
    }

    const match = envelopes.find((env) => (env as any).id === id) ?? envelopes[envelopes.length - 1];
    if ('error' in match) throw envelopeError(match.error);
    return match.result as T;
  }

  async initialize(): Promise<InitializeResult> {
    if (this.initialized && this.server) return this.server;

    const protocolVersions = ['2025-06-18', '2024-11-05', '2024-10-07'];
    let lastError: Error | null = null;

    for (const protocolVersion of protocolVersions) {
      try {
        const result = await this.rpc<InitializeResult>('initialize', {
          protocolVersion,
          clientInfo: {
            name: this.opts.clientName || 'surfingbro-sidepanel',
            version: this.opts.clientVersion || '0.1.0',
          },
          capabilities: {
            roots: { listChanged: false },
          },
        });
        await this.rpc('notifications/initialized', {}, true);
        this.initialized = true;
        this.server = result;
        if (result.protocolVersion?.trim()) {
          this.opts.mcpProtocolVersion = result.protocolVersion.trim();
        }
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    throw lastError ?? new Error('Failed to initialize MCP client');
  }

  async listTools(): Promise<McpTool[]> {
    await this.initialize();
    const out: McpTool[] = [];
    let cursor: string | undefined;

    do {
      const result = await this.rpc<{ tools?: McpTool[]; nextCursor?: string }>(
        'tools/list',
        cursor ? { cursor } : {},
      );
      if (result.tools?.length) out.push(...result.tools);
      cursor = result.nextCursor;
    } while (cursor);

    return out;
  }

  async callTool(name: string, args?: Record<string, unknown>): Promise<McpCallToolResult> {
    await this.initialize();
    return this.rpc<McpCallToolResult>('tools/call', {
      name,
      arguments: args ?? {},
    });
  }

  async listResources(): Promise<McpResource[]> {
    await this.initialize();
    const out: McpResource[] = [];
    let cursor: string | undefined;

    do {
      const result = await this.rpc<{ resources?: McpResource[]; nextCursor?: string }>(
        'resources/list',
        cursor ? { cursor } : {},
      );
      if (result.resources?.length) out.push(...result.resources);
      cursor = result.nextCursor;
    } while (cursor);

    return out;
  }

  async listResourceTemplates(): Promise<McpResourceTemplate[]> {
    await this.initialize();
    const out: McpResourceTemplate[] = [];
    let cursor: string | undefined;

    do {
      const result = await this.rpc<{ resourceTemplates?: McpResourceTemplate[]; nextCursor?: string }>(
        'resources/templates/list',
        cursor ? { cursor } : {},
      );
      if (result.resourceTemplates?.length) out.push(...result.resourceTemplates);
      cursor = result.nextCursor;
    } while (cursor);

    return out;
  }

  async readResource(uri: string): Promise<McpReadResourceResult> {
    await this.initialize();
    return this.rpc<McpReadResourceResult>('resources/read', { uri });
  }
}
