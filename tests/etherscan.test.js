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
    method: 'tools/list',
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

  console.log('Server response:', output);
  const response = JSON.parse(output);
  console.log('Parsed response:', JSON.stringify(response, null, 2));
  assert.strictEqual(response.jsonrpc, '2.0');
  assert.strictEqual(response.id, '1');
  
  // Check if response has the expected structure
  if (response.error) {
    console.error('Error in response:', response.error);
    assert.fail(`Server returned an error: ${JSON.stringify(response.error)}`);
  }
  
  assert.ok(response.result, 'Response should have a result property');
  assert.ok(Array.isArray(response.result.tools), 'Result should have an array of tools');
  assert.ok(response.result.tools.length > 0, 'Tools array should not be empty');

  server.kill();
});
