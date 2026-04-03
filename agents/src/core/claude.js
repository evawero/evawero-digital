const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Run an agent with tool use loop.
 * Returns { text, toolCalls, tokenUsage }
 */
async function runAgent(systemPrompt, userMessage, tools = [], model = 'claude-sonnet-4-6') {
  const messages = [{ role: 'user', content: userMessage }];
  const allToolCalls = [];
  let totalInput = 0;
  let totalOutput = 0;

  // Tool handlers map — populated by caller via tools array
  const toolHandlers = {};
  const toolDefs = tools.map(t => {
    toolHandlers[t.name] = t.handler;
    return {
      name: t.name,
      description: t.description,
      input_schema: t.input_schema,
    };
  });

  let iteration = 0;
  const MAX_ITERATIONS = 25;

  while (iteration < MAX_ITERATIONS) {
    iteration++;

    const params = {
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    };
    if (toolDefs.length > 0) params.tools = toolDefs;

    const response = await client.messages.create(params);

    totalInput += response.usage?.input_tokens || 0;
    totalOutput += response.usage?.output_tokens || 0;

    // Check if there are tool calls
    const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');

    if (toolUseBlocks.length === 0 || response.stop_reason === 'end_turn') {
      // No more tool calls — extract final text
      const textBlocks = response.content.filter(b => b.type === 'text');
      const text = textBlocks.map(b => b.text).join('\n');
      return {
        text,
        toolCalls: allToolCalls,
        tokenUsage: { input: totalInput, output: totalOutput },
      };
    }

    // Process tool calls
    messages.push({ role: 'assistant', content: response.content });

    const toolResults = [];
    for (const block of toolUseBlocks) {
      allToolCalls.push({ name: block.name, input: block.input });

      let result;
      try {
        const handler = toolHandlers[block.name];
        if (!handler) throw new Error(`No handler for tool: ${block.name}`);
        result = await handler(block.input);
      } catch (err) {
        result = { error: err.message };
      }

      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: typeof result === 'string' ? result : JSON.stringify(result),
      });
    }

    messages.push({ role: 'user', content: toolResults });
  }

  // Max iterations reached
  return {
    text: 'Agent reached maximum iteration limit.',
    toolCalls: allToolCalls,
    tokenUsage: { input: totalInput, output: totalOutput },
  };
}

module.exports = { runAgent };
