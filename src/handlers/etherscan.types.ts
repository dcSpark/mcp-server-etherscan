export interface GetBalanceInput {
  address: string;
  tag?: string;
}

export interface GetAbiInput {
  address: string;
}

export interface GetSourceCodeInput {
  address: string;
}

export interface GetTransactionInput {
  txhash: string;
}

export interface GetBlockByNumberInput {
  blockno: string;
  boolean?: boolean;
}

export interface GetTokenBalanceInput {
  contractaddress: string;
  address: string;
  tag?: string;
}

export interface GetGasPriceInput {
  // No parameters required
}

export interface GetBlockNumberInput {
  // No parameters required
}

// Token endpoints
export interface GetTokenSupplyInput {
  contractaddress: string;
}

export interface GetTokenTransfersByAddressInput {
  address: string;
  contractaddress?: string;
  startblock?: string;
  endblock?: string;
  page?: string;
  offset?: string;
  sort?: string;
}

export interface GetERC721TokenBalanceInput {
  contractaddress: string;
  address: string;
  tag?: string;
}

export interface GetERC721TransfersByAddressInput {
  address: string;
  contractaddress?: string;
  startblock?: string;
  endblock?: string;
  page?: string;
  offset?: string;
  sort?: string;
}

export interface GetERC1155TransfersByAddressInput {
  address: string;
  contractaddress?: string;
  startblock?: string;
  endblock?: string;
  page?: string;
  offset?: string;
  sort?: string;
}

export interface GetTokenInfoInput {
  contractaddress: string;
}

export interface GetTokenHolderListInput {
  contractaddress: string;
  page?: string;
  offset?: string;
}

export interface GetTokenHolderCountInput {
  contractaddress: string;
}

// Account endpoints
export interface GetNormalTransactionsByAddressInput {
  address: string;
  startblock?: string;
  endblock?: string;
  page?: string;
  offset?: string;
  sort?: string;
}

export interface GetInternalTransactionsByAddressInput {
  address: string;
  startblock?: string;
  endblock?: string;
  page?: string;
  offset?: string;
  sort?: string;
}

export interface GetInternalTransactionsByHashInput {
  txhash: string;
}

export interface GetInternalTransactionsByBlockRangeInput {
  startblock: string;
  endblock: string;
  page?: string;
  offset?: string;
  sort?: string;
}

export interface GetMinBalanceForAddressInput {
  address: string;
  tag?: string;
}

export interface GetHistoricalEtherBalanceInput {
  address: string;
  blockno: string;
}

export interface GetHistoricalTokenBalanceInput {
  contractaddress: string;
  address: string;
  blockno: string;
}

export interface GetBlocksMinedByAddressInput {
  address: string;
  page?: string;
  offset?: string;
}

// Transaction endpoints
export interface GetContractExecutionStatusInput {
  txhash: string;
}

export interface GetTransactionReceiptStatusInput {
  txhash: string;
}

// Block endpoints
export interface GetBlockRewardInput {
  blockno: string;
}

export interface GetBlockCountdownInput {
  blockno: string;
}

export interface GetBlockEstimatedTimeInput {
  blockno: string;
}

export interface GetDailyBlockCountInput {
  startdate: string;
  enddate: string;
  sort?: string;
}

export interface GetDailyBlockRewardsInput {
  startdate: string;
  enddate: string;
  sort?: string;
}

export interface GetDailyBlockSizeInput {
  startdate: string;
  enddate: string;
  sort?: string;
}

// Gas tracker endpoints
export interface GetGasOracleInput {
  // No parameters required
}

export interface GetEstimationConfirmationTimeInput {
  gasprice: string;
}

export interface GetDailyAverageGasLimitInput {
  startdate: string;
  enddate: string;
  sort?: string;
}

export interface GetDailyAverageGasPriceInput {
  startdate: string;
  enddate: string;
  sort?: string;
}

export interface GetDailyAverageGasUsedInput {
  startdate: string;
  enddate: string;
  sort?: string;
}

// Stats endpoints
export interface GetTotalEtherSupplyInput {
  // No parameters required
}

export interface GetEtherLastPriceInput {
  // No parameters required
}

export interface GetEthereumNodesInput {
  // No parameters required
}

export interface GetTotalNodesCountInput {
  // No parameters required
}
