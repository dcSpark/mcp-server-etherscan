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
  GetBlockNumberInput,
  // Token endpoints
  GetTokenSupplyInput,
  GetTokenTransfersByAddressInput,
  GetERC721TokenBalanceInput,
  GetERC721TransfersByAddressInput,
  GetERC1155TransfersByAddressInput,
  GetTokenInfoInput,
  GetTokenHolderListInput,
  GetTokenHolderCountInput,
  // Account endpoints
  GetNormalTransactionsByAddressInput,
  GetInternalTransactionsByAddressInput,
  GetInternalTransactionsByHashInput,
  GetInternalTransactionsByBlockRangeInput,
  GetMinBalanceForAddressInput,
  GetHistoricalEtherBalanceInput,
  GetHistoricalTokenBalanceInput,
  GetBlocksMinedByAddressInput,
  // Transaction endpoints
  GetContractExecutionStatusInput,
  GetTransactionReceiptStatusInput,
  // Block endpoints
  GetBlockRewardInput,
  GetBlockCountdownInput,
  GetBlockEstimatedTimeInput,
  GetDailyBlockCountInput,
  GetDailyBlockRewardsInput,
  GetDailyBlockSizeInput,
  // Gas tracker endpoints
  GetGasOracleInput,
  GetEstimationConfirmationTimeInput,
  GetDailyAverageGasLimitInput,
  GetDailyAverageGasPriceInput,
  GetDailyAverageGasUsedInput,
  // Stats endpoints
  GetTotalEtherSupplyInput,
  GetEtherLastPriceInput,
  GetEthereumNodesInput,
  GetTotalNodesCountInput
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

/**
 * Get ERC20-Token TotalSupply by ContractAddress
 */
export const getTokenSupplyHandler = async (input: GetTokenSupplyInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate contract address
    const contractAddressValidation = validateEthereumAddress(input.contractaddress);
    if (contractAddressValidation !== true) {
      return contractAddressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "stats");
    params.append("action", "tokensupply");
    params.append("contractaddress", input.contractaddress);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting token supply: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting token supply: ${data.message}`);
    }

    return createSuccessResponse(`Token supply for ${input.contractaddress}: ${data.result}`);
  } catch (error) {
    return createErrorResponse(`Error getting token supply: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Token Transfers by Address
 */
export const getTokenTransfersByAddressHandler = async (input: GetTokenTransfersByAddressInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate address
    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    // Validate contract address if provided
    if (input.contractaddress) {
      const contractAddressValidation = validateEthereumAddress(input.contractaddress);
      if (contractAddressValidation !== true) {
        return contractAddressValidation;
      }
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "tokentx");
    params.append("address", input.address);
    if (input.contractaddress) params.append("contractaddress", input.contractaddress);
    if (input.startblock) params.append("startblock", input.startblock);
    if (input.endblock) params.append("endblock", input.endblock);
    if (input.page) params.append("page", input.page);
    if (input.offset) params.append("offset", input.offset);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting token transfers: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting token transfers: ${data.message}`);
    }

    return createSuccessResponse(`Token transfers for ${input.address}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting token transfers: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get ERC-721 Token Balance for an address
 */
export const getERC721TokenBalanceHandler = async (input: GetERC721TokenBalanceInput): Promise<ToolResultSchema<any>> => {
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
    params.append("action", "tokenbalancenft");
    params.append("contractaddress", input.contractaddress);
    params.append("address", input.address);
    params.append("tag", input.tag || "latest");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting ERC-721 token balance: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting ERC-721 token balance: ${data.message}`);
    }

    return createSuccessResponse(`ERC-721 token balance for ${input.address} (contract: ${input.contractaddress}): ${data.result}`);
  } catch (error) {
    return createErrorResponse(`Error getting ERC-721 token balance: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get ERC-721 Token Transfers by Address
 */
export const getERC721TransfersByAddressHandler = async (input: GetERC721TransfersByAddressInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate address
    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    // Validate contract address if provided
    if (input.contractaddress) {
      const contractAddressValidation = validateEthereumAddress(input.contractaddress);
      if (contractAddressValidation !== true) {
        return contractAddressValidation;
      }
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "tokennfttx");
    params.append("address", input.address);
    if (input.contractaddress) params.append("contractaddress", input.contractaddress);
    if (input.startblock) params.append("startblock", input.startblock);
    if (input.endblock) params.append("endblock", input.endblock);
    if (input.page) params.append("page", input.page);
    if (input.offset) params.append("offset", input.offset);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting ERC-721 token transfers: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting ERC-721 token transfers: ${data.message}`);
    }

    return createSuccessResponse(`ERC-721 token transfers for ${input.address}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting ERC-721 token transfers: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get ERC-1155 Token Transfers by Address
 */
export const getERC1155TransfersByAddressHandler = async (input: GetERC1155TransfersByAddressInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate address
    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    // Validate contract address if provided
    if (input.contractaddress) {
      const contractAddressValidation = validateEthereumAddress(input.contractaddress);
      if (contractAddressValidation !== true) {
        return contractAddressValidation;
      }
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "token1155tx");
    params.append("address", input.address);
    if (input.contractaddress) params.append("contractaddress", input.contractaddress);
    if (input.startblock) params.append("startblock", input.startblock);
    if (input.endblock) params.append("endblock", input.endblock);
    if (input.page) params.append("page", input.page);
    if (input.offset) params.append("offset", input.offset);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting ERC-1155 token transfers: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting ERC-1155 token transfers: ${data.message}`);
    }

    return createSuccessResponse(`ERC-1155 token transfers for ${input.address}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting ERC-1155 token transfers: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Token Info by Contract Address
 */
export const getTokenInfoHandler = async (input: GetTokenInfoInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate contract address
    const contractAddressValidation = validateEthereumAddress(input.contractaddress);
    if (contractAddressValidation !== true) {
      return contractAddressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "token");
    params.append("action", "tokeninfo");
    params.append("contractaddress", input.contractaddress);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting token info: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting token info: ${data.message}`);
    }

    return createSuccessResponse(`Token info for ${input.contractaddress}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting token info: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Token Holder List by Contract Address
 */
export const getTokenHolderListHandler = async (input: GetTokenHolderListInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate contract address
    const contractAddressValidation = validateEthereumAddress(input.contractaddress);
    if (contractAddressValidation !== true) {
      return contractAddressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "token");
    params.append("action", "tokenholderlist");
    params.append("contractaddress", input.contractaddress);
    if (input.page) params.append("page", input.page);
    if (input.offset) params.append("offset", input.offset);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting token holder list: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting token holder list: ${data.message}`);
    }

    return createSuccessResponse(`Token holder list for ${input.contractaddress}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting token holder list: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Token Holder Count by Contract Address
 */
export const getTokenHolderCountHandler = async (input: GetTokenHolderCountInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate contract address
    const contractAddressValidation = validateEthereumAddress(input.contractaddress);
    if (contractAddressValidation !== true) {
      return contractAddressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "token");
    params.append("action", "tokenholdercount");
    params.append("contractaddress", input.contractaddress);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting token holder count: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting token holder count: ${data.message}`);
    }

    return createSuccessResponse(`Token holder count for ${input.contractaddress}: ${data.result}`);
  } catch (error) {
    return createErrorResponse(`Error getting token holder count: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get a list of 'Normal' Transactions By Address
 */
export const getNormalTransactionsByAddressHandler = async (input: GetNormalTransactionsByAddressInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate address
    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "txlist");
    params.append("address", input.address);
    if (input.startblock) params.append("startblock", input.startblock);
    if (input.endblock) params.append("endblock", input.endblock);
    if (input.page) params.append("page", input.page);
    if (input.offset) params.append("offset", input.offset);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting normal transactions: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting normal transactions: ${data.message}`);
    }

    return createSuccessResponse(`Normal transactions for ${input.address}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting normal transactions: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get a list of 'Internal' Transactions by Address
 */
export const getInternalTransactionsByAddressHandler = async (input: GetInternalTransactionsByAddressInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate address
    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "txlistinternal");
    params.append("address", input.address);
    if (input.startblock) params.append("startblock", input.startblock);
    if (input.endblock) params.append("endblock", input.endblock);
    if (input.page) params.append("page", input.page);
    if (input.offset) params.append("offset", input.offset);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting internal transactions: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting internal transactions: ${data.message}`);
    }

    return createSuccessResponse(`Internal transactions for ${input.address}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting internal transactions: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get a list of 'Internal' Transactions by Transaction Hash
 */
export const getInternalTransactionsByHashHandler = async (input: GetInternalTransactionsByHashInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.txhash || !/^0x[a-fA-F0-9]{64}$/.test(input.txhash)) {
      return createErrorResponse(`Invalid transaction hash: ${input.txhash}`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "txlistinternal");
    params.append("txhash", input.txhash);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting internal transactions by hash: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting internal transactions by hash: ${data.message}`);
    }

    return createSuccessResponse(`Internal transactions for transaction ${input.txhash}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting internal transactions by hash: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get a list of 'Internal' Transactions by Block Range
 */
export const getInternalTransactionsByBlockRangeHandler = async (input: GetInternalTransactionsByBlockRangeInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.startblock || !/^\d+$/.test(input.startblock)) {
      return createErrorResponse(`Invalid start block: ${input.startblock}`);
    }

    if (!input.endblock || !/^\d+$/.test(input.endblock)) {
      return createErrorResponse(`Invalid end block: ${input.endblock}`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "txlistinternal");
    params.append("startblock", input.startblock);
    params.append("endblock", input.endblock);
    if (input.page) params.append("page", input.page);
    if (input.offset) params.append("offset", input.offset);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting internal transactions by block range: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting internal transactions by block range: ${data.message}`);
    }

    return createSuccessResponse(`Internal transactions for blocks ${input.startblock} to ${input.endblock}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting internal transactions by block range: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Minimum Balance for Address
 */
export const getMinBalanceForAddressHandler = async (input: GetMinBalanceForAddressInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate address
    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "balancehistory");
    params.append("address", input.address);
    params.append("tag", input.tag || "latest");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting minimum balance: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting minimum balance: ${data.message}`);
    }

    // Convert wei to ether
    const balanceInWei = data.result;
    const balanceInEther = parseFloat(balanceInWei) / 1e18;

    return createSuccessResponse(`Minimum balance for ${input.address}: ${balanceInEther} ETH (${balanceInWei} Wei)`);
  } catch (error) {
    return createErrorResponse(`Error getting minimum balance: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Historical Ether Balance for a Single Address by BlockNo
 */
export const getHistoricalEtherBalanceHandler = async (input: GetHistoricalEtherBalanceInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate address
    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    if (!input.blockno || !/^\d+$/.test(input.blockno)) {
      return createErrorResponse(`Invalid block number: ${input.blockno}`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "balancehistory");
    params.append("address", input.address);
    params.append("blockno", input.blockno);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting historical ether balance: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting historical ether balance: ${data.message}`);
    }

    // Convert wei to ether
    const balanceInWei = data.result;
    const balanceInEther = parseFloat(balanceInWei) / 1e18;

    return createSuccessResponse(`Historical ether balance for ${input.address} at block ${input.blockno}: ${balanceInEther} ETH (${balanceInWei} Wei)`);
  } catch (error) {
    return createErrorResponse(`Error getting historical ether balance: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Historical ERC-20 Token Account Balance for a Single Address by BlockNo
 */
export const getHistoricalTokenBalanceHandler = async (input: GetHistoricalTokenBalanceInput): Promise<ToolResultSchema<any>> => {
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

    if (!input.blockno || !/^\d+$/.test(input.blockno)) {
      return createErrorResponse(`Invalid block number: ${input.blockno}`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "tokenbalancehistory");
    params.append("contractaddress", input.contractaddress);
    params.append("address", input.address);
    params.append("blockno", input.blockno);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting historical token balance: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting historical token balance: ${data.message}`);
    }

    return createSuccessResponse(`Historical token balance for ${input.address} (contract: ${input.contractaddress}) at block ${input.blockno}: ${data.result}`);
  } catch (error) {
    return createErrorResponse(`Error getting historical token balance: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get a list of Blocks Mined by Address
 */
export const getBlocksMinedByAddressHandler = async (input: GetBlocksMinedByAddressInput): Promise<ToolResultSchema<any>> => {
  try {
    // Validate address
    const addressValidation = validateEthereumAddress(input.address);
    if (addressValidation !== true) {
      return addressValidation;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "account");
    params.append("action", "getminedblocks");
    params.append("address", input.address);
    if (input.page) params.append("page", input.page);
    if (input.offset) params.append("offset", input.offset);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting blocks mined: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting blocks mined: ${data.message}`);
    }

    return createSuccessResponse(`Blocks mined by ${input.address}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting blocks mined: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Check Contract Execution Status
 */
export const getContractExecutionStatusHandler = async (input: GetContractExecutionStatusInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.txhash || !/^0x[a-fA-F0-9]{64}$/.test(input.txhash)) {
      return createErrorResponse(`Invalid transaction hash: ${input.txhash}`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "transaction");
    params.append("action", "getstatus");
    params.append("txhash", input.txhash);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting contract execution status: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting contract execution status: ${data.message}`);
    }

    return createSuccessResponse(`Contract execution status for ${input.txhash}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting contract execution status: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Check Transaction Receipt Status
 */
export const getTransactionReceiptStatusHandler = async (input: GetTransactionReceiptStatusInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.txhash || !/^0x[a-fA-F0-9]{64}$/.test(input.txhash)) {
      return createErrorResponse(`Invalid transaction hash: ${input.txhash}`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "transaction");
    params.append("action", "gettxreceiptstatus");
    params.append("txhash", input.txhash);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting transaction receipt status: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting transaction receipt status: ${data.message}`);
    }

    return createSuccessResponse(`Transaction receipt status for ${input.txhash}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting transaction receipt status: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Block Rewards by BlockNo
 */
export const getBlockRewardHandler = async (input: GetBlockRewardInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.blockno || !/^\d+$/.test(input.blockno)) {
      return createErrorResponse(`Invalid block number: ${input.blockno}`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "block");
    params.append("action", "getblockreward");
    params.append("blockno", input.blockno);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting block reward: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting block reward: ${data.message}`);
    }

    return createSuccessResponse(`Block reward for ${input.blockno}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting block reward: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Block Countdown by BlockNo
 */
export const getBlockCountdownHandler = async (input: GetBlockCountdownInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.blockno || !/^\d+$/.test(input.blockno)) {
      return createErrorResponse(`Invalid block number: ${input.blockno}`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "block");
    params.append("action", "getblockcountdown");
    params.append("blockno", input.blockno);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting block countdown: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting block countdown: ${data.message}`);
    }

    return createSuccessResponse(`Block countdown for ${input.blockno}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting block countdown: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Estimated Block Countdown Time by BlockNo
 */
export const getBlockEstimatedTimeHandler = async (input: GetBlockEstimatedTimeInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.blockno || !/^\d+$/.test(input.blockno)) {
      return createErrorResponse(`Invalid block number: ${input.blockno}`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "block");
    params.append("action", "getblocknobytime");
    params.append("timestamp", Math.floor(Date.now() / 1000).toString());
    params.append("closest", "before");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting block estimated time: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting block estimated time: ${data.message}`);
    }

    const currentBlock = parseInt(data.result);
    const targetBlock = parseInt(input.blockno);
    const blocksRemaining = targetBlock - currentBlock;
    const estimatedTimeInSeconds = blocksRemaining * 13; // Assuming 13 seconds per block on Ethereum

    return createSuccessResponse(`Estimated time for block ${input.blockno}: ${Math.floor(estimatedTimeInSeconds / 86400)} days, ${Math.floor((estimatedTimeInSeconds % 86400) / 3600)} hours, ${Math.floor((estimatedTimeInSeconds % 3600) / 60)} minutes, ${estimatedTimeInSeconds % 60} seconds`);
  } catch (error) {
    return createErrorResponse(`Error getting block estimated time: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Daily Block Count
 */
export const getDailyBlockCountHandler = async (input: GetDailyBlockCountInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.startdate || !/^\d{4}-\d{2}-\d{2}$/.test(input.startdate)) {
      return createErrorResponse(`Invalid start date: ${input.startdate}. Format should be YYYY-MM-DD`);
    }

    if (!input.enddate || !/^\d{4}-\d{2}-\d{2}$/.test(input.enddate)) {
      return createErrorResponse(`Invalid end date: ${input.enddate}. Format should be YYYY-MM-DD`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "stats");
    params.append("action", "dailyblkcount");
    params.append("startdate", input.startdate);
    params.append("enddate", input.enddate);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting daily block count: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting daily block count: ${data.message}`);
    }

    return createSuccessResponse(`Daily block count from ${input.startdate} to ${input.enddate}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting daily block count: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Daily Block Rewards
 */
export const getDailyBlockRewardsHandler = async (input: GetDailyBlockRewardsInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.startdate || !/^\d{4}-\d{2}-\d{2}$/.test(input.startdate)) {
      return createErrorResponse(`Invalid start date: ${input.startdate}. Format should be YYYY-MM-DD`);
    }

    if (!input.enddate || !/^\d{4}-\d{2}-\d{2}$/.test(input.enddate)) {
      return createErrorResponse(`Invalid end date: ${input.enddate}. Format should be YYYY-MM-DD`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "stats");
    params.append("action", "dailyblockrewards");
    params.append("startdate", input.startdate);
    params.append("enddate", input.enddate);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting daily block rewards: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting daily block rewards: ${data.message}`);
    }

    return createSuccessResponse(`Daily block rewards from ${input.startdate} to ${input.enddate}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting daily block rewards: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Daily Block Size
 */
export const getDailyBlockSizeHandler = async (input: GetDailyBlockSizeInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.startdate || !/^\d{4}-\d{2}-\d{2}$/.test(input.startdate)) {
      return createErrorResponse(`Invalid start date: ${input.startdate}. Format should be YYYY-MM-DD`);
    }

    if (!input.enddate || !/^\d{4}-\d{2}-\d{2}$/.test(input.enddate)) {
      return createErrorResponse(`Invalid end date: ${input.enddate}. Format should be YYYY-MM-DD`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "stats");
    params.append("action", "dailyblksize");
    params.append("startdate", input.startdate);
    params.append("enddate", input.enddate);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting daily block size: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting daily block size: ${data.message}`);
    }

    return createSuccessResponse(`Daily block size from ${input.startdate} to ${input.enddate}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting daily block size: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Gas Oracle
 */
export const getGasOracleHandler = async (input: GetGasOracleInput): Promise<ToolResultSchema<any>> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "gastracker");
    params.append("action", "gasoracle");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting gas oracle: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting gas oracle: ${data.message}`);
    }

    return createSuccessResponse(`Gas oracle data: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting gas oracle: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Estimation of Confirmation Time
 */
export const getEstimationConfirmationTimeHandler = async (input: GetEstimationConfirmationTimeInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.gasprice || !/^\d+$/.test(input.gasprice)) {
      return createErrorResponse(`Invalid gas price: ${input.gasprice}`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "gastracker");
    params.append("action", "gasestimate");
    params.append("gasprice", input.gasprice);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting estimation confirmation time: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting estimation confirmation time: ${data.message}`);
    }

    return createSuccessResponse(`Estimated confirmation time for gas price ${input.gasprice} Gwei: ${data.result} seconds`);
  } catch (error) {
    return createErrorResponse(`Error getting estimation confirmation time: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Daily Average Gas Limit
 */
export const getDailyAverageGasLimitHandler = async (input: GetDailyAverageGasLimitInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.startdate || !/^\d{4}-\d{2}-\d{2}$/.test(input.startdate)) {
      return createErrorResponse(`Invalid start date: ${input.startdate}. Format should be YYYY-MM-DD`);
    }

    if (!input.enddate || !/^\d{4}-\d{2}-\d{2}$/.test(input.enddate)) {
      return createErrorResponse(`Invalid end date: ${input.enddate}. Format should be YYYY-MM-DD`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "stats");
    params.append("action", "dailyavggaslimit");
    params.append("startdate", input.startdate);
    params.append("enddate", input.enddate);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting daily average gas limit: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting daily average gas limit: ${data.message}`);
    }

    return createSuccessResponse(`Daily average gas limit from ${input.startdate} to ${input.enddate}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting daily average gas limit: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Daily Average Gas Price
 */
export const getDailyAverageGasPriceHandler = async (input: GetDailyAverageGasPriceInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.startdate || !/^\d{4}-\d{2}-\d{2}$/.test(input.startdate)) {
      return createErrorResponse(`Invalid start date: ${input.startdate}. Format should be YYYY-MM-DD`);
    }

    if (!input.enddate || !/^\d{4}-\d{2}-\d{2}$/.test(input.enddate)) {
      return createErrorResponse(`Invalid end date: ${input.enddate}. Format should be YYYY-MM-DD`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "stats");
    params.append("action", "dailyavggasprice");
    params.append("startdate", input.startdate);
    params.append("enddate", input.enddate);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting daily average gas price: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting daily average gas price: ${data.message}`);
    }

    return createSuccessResponse(`Daily average gas price from ${input.startdate} to ${input.enddate}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting daily average gas price: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Daily Average Gas Used
 */
export const getDailyAverageGasUsedHandler = async (input: GetDailyAverageGasUsedInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.startdate || !/^\d{4}-\d{2}-\d{2}$/.test(input.startdate)) {
      return createErrorResponse(`Invalid start date: ${input.startdate}. Format should be YYYY-MM-DD`);
    }

    if (!input.enddate || !/^\d{4}-\d{2}-\d{2}$/.test(input.enddate)) {
      return createErrorResponse(`Invalid end date: ${input.enddate}. Format should be YYYY-MM-DD`);
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "stats");
    params.append("action", "dailyavggasused");
    params.append("startdate", input.startdate);
    params.append("enddate", input.enddate);
    if (input.sort) params.append("sort", input.sort);
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting daily average gas used: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting daily average gas used: ${data.message}`);
    }

    return createSuccessResponse(`Daily average gas used from ${input.startdate} to ${input.enddate}: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting daily average gas used: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Total Ether Supply
 */
export const getTotalEtherSupplyHandler = async (input: GetTotalEtherSupplyInput): Promise<ToolResultSchema<any>> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "stats");
    params.append("action", "ethsupply");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting total ether supply: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting total ether supply: ${data.message}`);
    }

    // Convert wei to ether
    const supplyInWei = data.result;
    const supplyInEther = parseFloat(supplyInWei) / 1e18;

    return createSuccessResponse(`Total Ether supply: ${supplyInEther} ETH (${supplyInWei} Wei)`);
  } catch (error) {
    return createErrorResponse(`Error getting total ether supply: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Ether Last Price
 */
export const getEtherLastPriceHandler = async (input: GetEtherLastPriceInput): Promise<ToolResultSchema<any>> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "stats");
    params.append("action", "ethprice");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting ether price: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting ether price: ${data.message}`);
    }

    return createSuccessResponse(`Ether price: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting ether price: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Ethereum Nodes
 */
export const getEthereumNodesHandler = async (input: GetEthereumNodesInput): Promise<ToolResultSchema<any>> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "stats");
    params.append("action", "nodecount");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting ethereum nodes: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting ethereum nodes: ${data.message}`);
    }

    return createSuccessResponse(`Ethereum nodes: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting ethereum nodes: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get Total Nodes Count
 */
export const getTotalNodesCountHandler = async (input: GetTotalNodesCountInput): Promise<ToolResultSchema<any>> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("module", "stats");
    params.append("action", "nodecounthistory");
    params.append("apikey", ETHERSCAN_API_KEY);

    // Make the API request
    const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return createErrorResponse(`Error getting total nodes count: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.status === "0") {
      return createErrorResponse(`Error getting total nodes count: ${data.message}`);
    }

    return createSuccessResponse(`Total nodes count: ${JSON.stringify(data.result, null, 2)}`);
  } catch (error) {
    return createErrorResponse(`Error getting total nodes count: ${error instanceof Error ? error.message : String(error)}`);
  }
};
