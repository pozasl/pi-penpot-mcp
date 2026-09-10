#!/usr/bin/env node
// Penpot MCP Client CLI Tool
// Usage: node penpot_mcp_client.js <command> [args...]
// Commands: init, tools, exec <code>, overview, api_info

const http = require('http');

const MCP_URL = process.env.PENPOT_MCP_URL || 'http://localhost:4401/mcp';
let sessionId = null;
let requestCounter = 0;

function postToMcp(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(MCP_URL);
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'Content-Length': Buffer.byteLength(data)
    };
    
    if (sessionId) {
      headers['Mcp-Session-Id'] = sessionId;
    }

    const req = http.request({
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'POST',
      headers: headers
    }, (res) => {
      const sid = res.headers['mcp-session-id'];
      if (sid && !sessionId) {
        sessionId = sid;
      }

      let response = '';
      res.on('data', (chunk) => { response += chunk; });
      res.on('end', () => {
        const lines = response.split('\n');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              resolve(JSON.parse(line.slice(5)));
            } catch (e) {
              reject(new Error(`Failed to parse JSON: ${e}`));
            }
            return;
          }
        }
        // Try parsing as plain JSON
        try {
          resolve(JSON.parse(response.trim()));
        } catch (e) {
          reject(new Error('No response from MCP server'));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function initialize() {
  const result = await postToMcp({
    jsonrpc: '2.0',
    id: ++requestCounter,
    method: 'initialize',
    params: {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'penpot-cli', version: '1.0.0' }
    }
  });

  // Send initialized notification
  await postToMcp({
    jsonrpc: '2.0',
    method: 'notifications/initialized',
    params: {}
  }).catch(() => {});

  return result;
}

async function callTool(name, args) {
  const result = await postToMcp({
    jsonrpc: '2.0',
    id: ++requestCounter,
    method: 'tools/call',
    params: { name: name, arguments: args }
  });
  return result;
}

async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'init':
        const initResult = await initialize();
        console.log('Connected to:', initResult.result?.serverInfo?.name);
        break;

      case 'tools':
        await initialize();
        const toolsResult = await callTool('tools/list', {});
        console.log(JSON.stringify(toolsResult, null, 2));
        break;

      case 'exec':
        const code = process.argv.slice(3).join(' ');
        if (!code) {
          console.error('Usage: penpot_mcp_client.js exec <code>');
          process.exit(1);
        }
        await initialize();
        const execResult = await callTool('execute_code', { code: code });
        console.log(JSON.stringify(execResult, null, 2));
        break;

      case 'overview':
        await initialize();
        const overviewResult = await callTool('high_level_overview', {});
        console.log(JSON.stringify(overviewResult, null, 2));
        break;

      case 'api_info':
        await initialize();
        const apiInfoResult = await callTool('penpot_api_info', {});
        console.log(JSON.stringify(apiInfoResult, null, 2));
        break;

      default:
        console.error('Usage: penpot_mcp_client.js <init|tools|exec|overview|api_info>');
        process.exit(1);
    }
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

main();