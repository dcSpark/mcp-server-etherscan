# MCP Etherscan

This repository contains a Model Context Protocol (MCP) server that provides Claude with access to Ethereum blockchain data via the Etherscan API. The server enables Claude to perform operations like checking wallet balances, getting contract ABIs, and retrieving transaction details on the Ethereum blockchain.

## Overview

The MCP server exposes several tools to Claude:

- `etherscan_get_balance`: Get the Ether balance for a single address
- `etherscan_get_abi`: Get the contract ABI for a verified smart contract
- `etherscan_get_source_code`: Get the source code for a verified smart contract
- `etherscan_get_transaction`: Get transaction details by hash
- `etherscan_get_block_by_number`: Get block details by number
- `etherscan_get_token_balance`: Get ERC-20 token balance for an address
- `etherscan_get_gas_price`: Get current gas price
- `etherscan_get_block_number`: Get current block number

## Prerequisites

- Node.js (v16 or higher)
- An Etherscan API key (get one at [https://etherscan.io/apis](https://etherscan.io/apis))
- Claude Desktop application

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/dcSpark/mcp-server-etherscan.git
   cd mcp-server-etherscan
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

### Configure Claude Desktop

To configure Claude Desktop to use this MCP server:

1. Open Claude Desktop
2. Navigate to the Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

3. Add the MCP server configuration:

```json
{
  "mcpServers": {
    "mcp-server-etherscan": {
      "command": "node",
      "args": [
        "/path/to/your/mcp-server-etherscan/build/index.js"
      ],
      "env": {
        "ETHERSCAN_API_KEY": "your-etherscan-api-key"
      }
    }
  }
}
```

### Running Locally

```bash
ETHERSCAN_API_KEY=your-etherscan-api-key node build/index.js
```

## Usage

Once configured, restart Claude Desktop. Claude will now have access to the Ethereum blockchain tools. You can ask Claude to:

1. Check a wallet balance:
   ```
   What's the balance of the Ethereum wallet address 0x742d35Cc6634C0532925a3b844Bc454e4438f44e?
   ```

2. Get a contract ABI:
   ```
   What's the ABI for the contract at 0x6B175474E89094C44Da98b954EedeAC495271d0F?
   ```

3. Get transaction details:
   ```
   What are the details of transaction 0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060?
   ```

Claude will use the MCP server to fetch this information directly from the Etherscan API.

## Development

### Testing

Run the tests with:

```bash
npm test
```

### Inspecting the MCP Server

You can use the MCP Inspector to test the server locally:

```bash
npm run inspector
```

This will start an interactive session where you can test the MCP server tools.

## License

MIT
