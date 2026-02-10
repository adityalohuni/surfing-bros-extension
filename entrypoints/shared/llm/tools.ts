export type ToolDefinition = {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export type ToolCall = {
  id: string;
  name: string;
  arguments: string;
};

export const mcpTools: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'browser_click',
      description: 'Click an element by CSS selector.',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string' },
        },
        required: ['selector'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_type',
      description: 'Type text into an element by CSS selector.',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string' },
          text: { type: 'string' },
          pressEnter: { type: 'boolean' },
        },
        required: ['selector', 'text'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_enter',
      description: 'Press Enter optionally on a selector.',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string' },
          key: { type: 'string' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_select',
      description: 'Select an option by value/label/index.',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string' },
          value: { type: 'string' },
          label: { type: 'string' },
          index: { type: 'number' },
          values: { type: 'array', items: { type: 'string' } },
          labels: { type: 'array', items: { type: 'string' } },
          indices: { type: 'array', items: { type: 'number' } },
        },
        required: ['selector'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_scroll',
      description: 'Scroll the page or an element.',
      parameters: {
        type: 'object',
        properties: {
          deltaX: { type: 'number' },
          deltaY: { type: 'number' },
          selector: { type: 'string' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_wait_for_selector',
      description: 'Wait for a selector to appear.',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string' },
          timeoutMs: { type: 'number' },
        },
        required: ['selector'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_find',
      description: 'Find elements matching a selector.',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string' },
        },
        required: ['selector'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_hover',
      description: 'Hover over an element by selector.',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string' },
        },
        required: ['selector'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_navigate',
      description: 'Navigate to a URL.',
      parameters: {
        type: 'object',
        properties: {
          url: { type: 'string' },
        },
        required: ['url'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_snapshot',
      description: 'Capture a DOM snapshot.',
      parameters: {
        type: 'object',
        properties: {
          includeHidden: { type: 'boolean' },
          maxElements: { type: 'number' },
          maxText: { type: 'number' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_screenshot',
      description: 'Capture a screenshot of the page or element.',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string' },
          format: { type: 'string', enum: ['png', 'jpeg'] },
          quality: { type: 'number' },
          padding: { type: 'number' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_back',
      description: 'Navigate back in history.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_forward',
      description: 'Navigate forward in history.',
      parameters: { type: 'object', properties: {} },
    },
  },
];

export const toolProtocolBlock = `You can call browser tools by emitting JSON in the exact format below.

If you need to use tools, respond with ONLY this JSON object (no extra text):
{
  "tool_calls": [
    {
      "id": "call_1",
      "name": "browser_click",
      "arguments": "{\\"selector\\": \\"...\\", \\"text\\": \\"...\\"}"
    }
  ]
}

If you do not need tools, respond normally in plain text.`;
