import {
  getBalanceHandler,
  getAbiHandler,
  getSourceCodeHandler,
  getTransactionHandler,
  getBlockByNumberHandler,
  getTokenBalanceHandler,
  getGasPriceHandler,
  getBlockNumberHandler,
  // Token endpoints
  getTokenSupplyHandler,
  getTokenTransfersByAddressHandler,
  getERC721TokenBalanceHandler,
  getERC721TransfersByAddressHandler,
  getERC1155TransfersByAddressHandler,
  getTokenInfoHandler,
  getTokenHolderListHandler,
  getTokenHolderCountHandler,
  // Account endpoints
  getNormalTransactionsByAddressHandler,
  getInternalTransactionsByAddressHandler,
  getInternalTransactionsByHashHandler,
  getInternalTransactionsByBlockRangeHandler,
  getMinBalanceForAddressHandler,
  getHistoricalEtherBalanceHandler,
  getHistoricalTokenBalanceHandler,
  getBlocksMinedByAddressHandler,
  // Transaction endpoints
  getContractExecutionStatusHandler,
  getTransactionReceiptStatusHandler,
  // Block endpoints
  getBlockRewardHandler,
  getBlockCountdownHandler,
  getBlockEstimatedTimeHandler,
  getDailyBlockCountHandler,
  getDailyBlockRewardsHandler,
  getDailyBlockSizeHandler,
  // Gas tracker endpoints
  getGasOracleHandler,
  getEstimationConfirmationTimeHandler,
  getDailyAverageGasLimitHandler,
  getDailyAverageGasPriceHandler,
  getDailyAverageGasUsedHandler,
  // Stats endpoints
  getTotalEtherSupplyHandler,
  getEtherLastPriceHandler,
  getEthereumNodesHandler,
  getTotalNodesCountHandler
} from "./handlers/etherscan.js";

export const tools = [
  // Core endpoints
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
  },
  
  // Token endpoints
  {
    name: "etherscan_get_token_supply",
    description: "Get the total supply of an ERC-20 token",
    inputSchema: {
      type: "object",
      properties: {
        contractaddress: { type: "string" }
      },
      required: ["contractaddress"]
    }
  },
  {
    name: "etherscan_get_token_transfers_by_address",
    description: "Get a list of ERC-20 token transfers by address",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string" },
        contractaddress: { type: "string" },
        startblock: { type: "string" },
        endblock: { type: "string" },
        page: { type: "string" },
        offset: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["address"]
    }
  },
  {
    name: "etherscan_get_erc721_token_balance",
    description: "Get ERC-721 token balance for an address",
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
    name: "etherscan_get_erc721_transfers_by_address",
    description: "Get a list of ERC-721 token transfers by address",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string" },
        contractaddress: { type: "string" },
        startblock: { type: "string" },
        endblock: { type: "string" },
        page: { type: "string" },
        offset: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["address"]
    }
  },
  {
    name: "etherscan_get_erc1155_transfers_by_address",
    description: "Get a list of ERC-1155 token transfers by address",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string" },
        contractaddress: { type: "string" },
        startblock: { type: "string" },
        endblock: { type: "string" },
        page: { type: "string" },
        offset: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["address"]
    }
  },
  {
    name: "etherscan_get_token_info",
    description: "Get token information by contract address",
    inputSchema: {
      type: "object",
      properties: {
        contractaddress: { type: "string" }
      },
      required: ["contractaddress"]
    }
  },
  {
    name: "etherscan_get_token_holder_list",
    description: "Get list of token holders by contract address",
    inputSchema: {
      type: "object",
      properties: {
        contractaddress: { type: "string" },
        page: { type: "string" },
        offset: { type: "string" }
      },
      required: ["contractaddress"]
    }
  },
  {
    name: "etherscan_get_token_holder_count",
    description: "Get count of token holders by contract address",
    inputSchema: {
      type: "object",
      properties: {
        contractaddress: { type: "string" }
      },
      required: ["contractaddress"]
    }
  },
  
  // Account endpoints
  {
    name: "etherscan_get_normal_transactions_by_address",
    description: "Get a list of normal transactions by address",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string" },
        startblock: { type: "string" },
        endblock: { type: "string" },
        page: { type: "string" },
        offset: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["address"]
    }
  },
  {
    name: "etherscan_get_internal_transactions_by_address",
    description: "Get a list of internal transactions by address",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string" },
        startblock: { type: "string" },
        endblock: { type: "string" },
        page: { type: "string" },
        offset: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["address"]
    }
  },
  {
    name: "etherscan_get_internal_transactions_by_hash",
    description: "Get a list of internal transactions by transaction hash",
    inputSchema: {
      type: "object",
      properties: {
        txhash: { type: "string" }
      },
      required: ["txhash"]
    }
  },
  {
    name: "etherscan_get_internal_transactions_by_block_range",
    description: "Get a list of internal transactions by block range",
    inputSchema: {
      type: "object",
      properties: {
        startblock: { type: "string" },
        endblock: { type: "string" },
        page: { type: "string" },
        offset: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["startblock", "endblock"]
    }
  },
  {
    name: "etherscan_get_min_balance_for_address",
    description: "Get minimum balance for an address",
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
    name: "etherscan_get_historical_ether_balance",
    description: "Get historical Ether balance for an address by block number",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string" },
        blockno: { type: "string" }
      },
      required: ["address", "blockno"]
    }
  },
  {
    name: "etherscan_get_historical_token_balance",
    description: "Get historical ERC-20 token balance for an address by block number",
    inputSchema: {
      type: "object",
      properties: {
        contractaddress: { type: "string" },
        address: { type: "string" },
        blockno: { type: "string" }
      },
      required: ["contractaddress", "address", "blockno"]
    }
  },
  {
    name: "etherscan_get_blocks_mined_by_address",
    description: "Get a list of blocks mined by address",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string" },
        page: { type: "string" },
        offset: { type: "string" }
      },
      required: ["address"]
    }
  },
  
  // Transaction endpoints
  {
    name: "etherscan_get_contract_execution_status",
    description: "Get contract execution status for a transaction",
    inputSchema: {
      type: "object",
      properties: {
        txhash: { type: "string" }
      },
      required: ["txhash"]
    }
  },
  {
    name: "etherscan_get_transaction_receipt_status",
    description: "Get transaction receipt status for a transaction",
    inputSchema: {
      type: "object",
      properties: {
        txhash: { type: "string" }
      },
      required: ["txhash"]
    }
  },
  
  // Block endpoints
  {
    name: "etherscan_get_block_reward",
    description: "Get block reward by block number",
    inputSchema: {
      type: "object",
      properties: {
        blockno: { type: "string" }
      },
      required: ["blockno"]
    }
  },
  {
    name: "etherscan_get_block_countdown",
    description: "Get block countdown by block number",
    inputSchema: {
      type: "object",
      properties: {
        blockno: { type: "string" }
      },
      required: ["blockno"]
    }
  },
  {
    name: "etherscan_get_block_estimated_time",
    description: "Get estimated time for a block number",
    inputSchema: {
      type: "object",
      properties: {
        blockno: { type: "string" }
      },
      required: ["blockno"]
    }
  },
  {
    name: "etherscan_get_daily_block_count",
    description: "Get daily block count for a date range",
    inputSchema: {
      type: "object",
      properties: {
        startdate: { type: "string" },
        enddate: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["startdate", "enddate"]
    }
  },
  {
    name: "etherscan_get_daily_block_rewards",
    description: "Get daily block rewards for a date range",
    inputSchema: {
      type: "object",
      properties: {
        startdate: { type: "string" },
        enddate: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["startdate", "enddate"]
    }
  },
  {
    name: "etherscan_get_daily_block_size",
    description: "Get daily block size for a date range",
    inputSchema: {
      type: "object",
      properties: {
        startdate: { type: "string" },
        enddate: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["startdate", "enddate"]
    }
  },
  
  // Gas tracker endpoints
  {
    name: "etherscan_get_gas_oracle",
    description: "Get gas oracle data",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "etherscan_get_estimation_confirmation_time",
    description: "Get estimation of confirmation time for a gas price",
    inputSchema: {
      type: "object",
      properties: {
        gasprice: { type: "string" }
      },
      required: ["gasprice"]
    }
  },
  {
    name: "etherscan_get_daily_average_gas_limit",
    description: "Get daily average gas limit for a date range",
    inputSchema: {
      type: "object",
      properties: {
        startdate: { type: "string" },
        enddate: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["startdate", "enddate"]
    }
  },
  {
    name: "etherscan_get_daily_average_gas_price",
    description: "Get daily average gas price for a date range",
    inputSchema: {
      type: "object",
      properties: {
        startdate: { type: "string" },
        enddate: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["startdate", "enddate"]
    }
  },
  {
    name: "etherscan_get_daily_average_gas_used",
    description: "Get daily average gas used for a date range",
    inputSchema: {
      type: "object",
      properties: {
        startdate: { type: "string" },
        enddate: { type: "string" },
        sort: { type: "string", enum: ["asc", "desc"] }
      },
      required: ["startdate", "enddate"]
    }
  },
  
  // Stats endpoints
  {
    name: "etherscan_get_total_ether_supply",
    description: "Get total Ether supply",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "etherscan_get_ether_last_price",
    description: "Get Ether last price",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "etherscan_get_ethereum_nodes",
    description: "Get Ethereum nodes",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "etherscan_get_total_nodes_count",
    description: "Get total nodes count",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

type handlerDictionary = Record<typeof tools[number]["name"], (input: any) => any>;

export const handlers: handlerDictionary = {
  // Core endpoints
  "etherscan_get_balance": getBalanceHandler,
  "etherscan_get_abi": getAbiHandler,
  "etherscan_get_source_code": getSourceCodeHandler,
  "etherscan_get_transaction": getTransactionHandler,
  "etherscan_get_block_by_number": getBlockByNumberHandler,
  "etherscan_get_token_balance": getTokenBalanceHandler,
  "etherscan_get_gas_price": getGasPriceHandler,
  "etherscan_get_block_number": getBlockNumberHandler,
  
  // Token endpoints
  "etherscan_get_token_supply": getTokenSupplyHandler,
  "etherscan_get_token_transfers_by_address": getTokenTransfersByAddressHandler,
  "etherscan_get_erc721_token_balance": getERC721TokenBalanceHandler,
  "etherscan_get_erc721_transfers_by_address": getERC721TransfersByAddressHandler,
  "etherscan_get_erc1155_transfers_by_address": getERC1155TransfersByAddressHandler,
  "etherscan_get_token_info": getTokenInfoHandler,
  "etherscan_get_token_holder_list": getTokenHolderListHandler,
  "etherscan_get_token_holder_count": getTokenHolderCountHandler,
  
  // Account endpoints
  "etherscan_get_normal_transactions_by_address": getNormalTransactionsByAddressHandler,
  "etherscan_get_internal_transactions_by_address": getInternalTransactionsByAddressHandler,
  "etherscan_get_internal_transactions_by_hash": getInternalTransactionsByHashHandler,
  "etherscan_get_internal_transactions_by_block_range": getInternalTransactionsByBlockRangeHandler,
  "etherscan_get_min_balance_for_address": getMinBalanceForAddressHandler,
  "etherscan_get_historical_ether_balance": getHistoricalEtherBalanceHandler,
  "etherscan_get_historical_token_balance": getHistoricalTokenBalanceHandler,
  "etherscan_get_blocks_mined_by_address": getBlocksMinedByAddressHandler,
  
  // Transaction endpoints
  "etherscan_get_contract_execution_status": getContractExecutionStatusHandler,
  "etherscan_get_transaction_receipt_status": getTransactionReceiptStatusHandler,
  
  // Block endpoints
  "etherscan_get_block_reward": getBlockRewardHandler,
  "etherscan_get_block_countdown": getBlockCountdownHandler,
  "etherscan_get_block_estimated_time": getBlockEstimatedTimeHandler,
  "etherscan_get_daily_block_count": getDailyBlockCountHandler,
  "etherscan_get_daily_block_rewards": getDailyBlockRewardsHandler,
  "etherscan_get_daily_block_size": getDailyBlockSizeHandler,
  
  // Gas tracker endpoints
  "etherscan_get_gas_oracle": getGasOracleHandler,
  "etherscan_get_estimation_confirmation_time": getEstimationConfirmationTimeHandler,
  "etherscan_get_daily_average_gas_limit": getDailyAverageGasLimitHandler,
  "etherscan_get_daily_average_gas_price": getDailyAverageGasPriceHandler,
  "etherscan_get_daily_average_gas_used": getDailyAverageGasUsedHandler,
  
  // Stats endpoints
  "etherscan_get_total_ether_supply": getTotalEtherSupplyHandler,
  "etherscan_get_ether_last_price": getEtherLastPriceHandler,
  "etherscan_get_ethereum_nodes": getEthereumNodesHandler,
  "etherscan_get_total_nodes_count": getTotalNodesCountHandler
};
