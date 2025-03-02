import {
  getBalanceHandler,
  getAbiHandler,
  getSourceCodeHandler,
  getTransactionHandler,
  getBlockByNumberHandler,
  getTokenBalanceHandler,
  getGasPriceHandler,
  getBlockNumberHandler
} from "./handlers/etherscan.js";

export const tools = [
  {
    name: "etherscan_get_balance",
    description: "Get the Ether balance for a single address",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string" },
        tag: { type: "string", enum: ["latest", "pending", "earliest"] }
      },
      required: ["address"]
    }
  },
  {
    name: "etherscan_get_abi",
    description: "Get the contract ABI for a verified smart contract",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string" }
      },
      required: ["address"]
    }
  },
  {
    name: "etherscan_get_source_code",
    description: "Get the source code for a verified smart contract",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string" }
      },
      required: ["address"]
    }
  },
  {
    name: "etherscan_get_transaction",
    description: "Get transaction details by hash",
    inputSchema: {
      type: "object",
      properties: {
        txhash: { type: "string" }
      },
      required: ["txhash"]
    }
  },
  {
    name: "etherscan_get_block_by_number",
    description: "Get block details by number",
    inputSchema: {
      type: "object",
      properties: {
        blockno: { type: "string" },
        boolean: { type: "boolean" }
      },
      required: ["blockno"]
    }
  },
  {
    name: "etherscan_get_token_balance",
    description: "Get ERC-20 token balance for an address",
    inputSchema: {
      type: "object",
      properties: {
        contractaddress: { type: "string" },
        address: { type: "string" },
        tag: { type: "string", enum: ["latest", "pending", "earliest"] }
      },
      required: ["contractaddress", "address"]
    }
  },
  {
    name: "etherscan_get_gas_price",
    description: "Get current gas price",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "etherscan_get_block_number",
    description: "Get current block number",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

type handlerDictionary = Record<typeof tools[number]["name"], (input: any) => any>;

export const handlers: handlerDictionary = {
  "etherscan_get_balance": getBalanceHandler,
  "etherscan_get_abi": getAbiHandler,
  "etherscan_get_source_code": getSourceCodeHandler,
  "etherscan_get_transaction": getTransactionHandler,
  "etherscan_get_block_by_number": getBlockByNumberHandler,
  "etherscan_get_token_balance": getTokenBalanceHandler,
  "etherscan_get_gas_price": getGasPriceHandler,
  "etherscan_get_block_number": getBlockNumberHandler
};
