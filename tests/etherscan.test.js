import { test } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = join(__dirname, '..', 'build', 'index.js');

test('MCP server responds to list_tools request', async () => {
  const server = spawn('node', [serverPath], {
    env: {
      ...process.env,
      TEST_MODE: 'true'
    }
  });

  const listToolsRequest = {
    jsonrpc: '2.0',
    id: '1',
    method: 'list_tools',
    params: {}
  };

  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

  let output = '';
  for await (const chunk of server.stdout) {
    output += chunk.toString();
    if (output.includes('\n')) {
      break;
    }
  }

  const response = JSON.parse(output);
  assert.strictEqual(response.jsonrpc, '2.0');
  assert.strictEqual(response.id, '1');
  assert.ok(Array.isArray(response.result.tools));
  assert.ok(response.result.tools.length > 0);

  server.kill();
});
