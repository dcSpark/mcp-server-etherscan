import { ToolResultSchema } from "../types.js";
import { createErrorResponse, createSuccessResponse, validateEthereumAddress } from "./utils.js";
import {
  GetBalanceInput,
  GetAbiInput,
  GetSourceCodeInput,
  GetTransactionInput,
  GetBlockByNumberInput,
  GetTokenBalanceInput,
  GetGasPriceInput,
  GetBlockNumberInput
} from "./etherscan.types.js";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const ETHERSCAN_API_BASE_URL = "https://api.etherscan.io/api";

/**
 * Get the Ether balance for a single address
 */
export const getBalanceHandler = async (input: GetBalanceInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate address
    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "balance");
    params.append("address", input.address);
    params.append("tag", input.tag || "latest");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting balance: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting balance: ${data.message}`);
    }

    // Convert wei to ether
    const balanceInWei = data.result;
    const balanceInEther = parseFloat(balanceInWei) / 1e18;

    return createSuccessResponse(`Balance for ${input.address}: ${balanceInEther} ETH (${balanceInWei} Wei)`);
  } catch (error) {
    return createErrorResponse(`Error getting balance: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get the contract ABI for a verified smart contract
 */
export const getAbiHandler = async (input: GetAbiInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate address
    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "contract");
    params.append("action", "getabi");
    params.append("address", input.address);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting ABI: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting ABI: ${data.message}`);
    }

    return createSuccessResponse(`ABI for ${input.address}: ${data.result}`);
  } catch (error) {
    return createErrorResponse(`Error getting ABI: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get the source code for a verified smart contract
 */
export const getSourceCodeHandler = async (input: GetSourceCodeInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate address
    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "contract");
    params.append("action", "getsourcecode");
    params.append("address", input.address);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting source code: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting source code: ${data.message}`);
    }

    const sourceCode = data.result[0];
    return createSuccessResponse(`Source code for ${input.address}: ${JSON.stringify(sourceCode, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting source code: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get transaction details by hash
 */
export const getTransactionHandler = async (input: GetTransactionInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.txhash || !/^0x[a-fA-F0-9]{64}$/.test(input.txhash)) {
      return createErrorResponse(`Invalid transaction hash: ${input.txhash}`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "proxy");
    params.append("action", "eth_getTransactionByHash");
    params.append("txhash", input.txhash);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting transaction: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.error) {
      return createErrorResponse(`Error getting transaction: ${data.error.message}`);
    }

    return createSuccessResponse(`Transaction details for ${input.txhash}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting transaction: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get block details by number
 */
export const getBlockByNumberHandler = async (input: GetBlockByNumberInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.blockno || !/^\d+$/.test(input.blockno)) {
      return createErrorResponse(`Invalid block number: ${input.blockno}`);
    }

    // Convert block number to hex
    const blockNoHex = `0x${parseInt(input.blockno).toString(16)}`;

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "proxy");
    params.append("action", "eth_getBlockByNumber");
    params.append("tag", blockNoHex);
    params.append("boolean", input.boolean === false ? "false" : "true");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting block: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.error) {
      return createErrorResponse(`Error getting block: ${data.error.message}`);
    }

    return createSuccessResponse(`Block details for ${input.blockno}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting block: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get ERC-20 token balance for an address
 */
export const getTokenBalanceHandler = async (input: GetTokenBalanceInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate addresses
    const contractAddressValidation = validateEthereumAddress(input.contractaddress);
    if (contractAddressValidation !== true) {
      return contractAddressValidation;
    }

    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "tokenbalance");
    params.append("contractaddress", input.contractaddress);
    params.append("address", input.address);
    params.append("tag", input.tag || "latest");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting token balance: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting token balance: ${data.message}`);
    }

    return createSuccessResponse(`Token balance for ${input.address} (contract: ${input.contractaddress}): ${data.result}`);
  } catch (error) {
    return createErrorResponse(`Error getting token balance: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get current gas price
 */
export const getGasPriceHandler = async (input: GetGasPriceInput): Promise<ToolResultSchema<any>> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "proxy");
    params.append("action", "eth_gasPrice");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting gas price: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.error) {
      return createErrorResponse(`Error getting gas price: ${data.error.message}`);
    }

    // Convert wei to gwei
    const gasPriceWei = parseInt(data.result, 16);
    const gasPriceGwei = gasPriceWei / 1e9;

    return createSuccessResponse(`Current gas price: ${gasPriceGwei} Gwei (${gasPriceWei} Wei)`);
  } catch (error) {
    return createErrorResponse(`Error getting gas price: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get current block number
 */
export const getBlockNumberHandler = async (input: GetBlockNumberInput): Promise<ToolResultSchema<any>> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "proxy");
    params.append("action", "eth_blockNumber");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting block number: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.error) {
      return createErrorResponse(`Error getting block number: ${data.error.message}`);
    }

    // Convert hex to decimal
    const blockNumberHex = data.result;
    const blockNumberDec = parseInt(blockNumberHex, 16);

    return createSuccessResponse(`Current block number: ${blockNumberDec} (${blockNumberHex})`);
  } catch (error) {
    return createErrorResponse(`Error getting block number: ${error instanceof Error ? error.message : String(error)}`);
  }
};
