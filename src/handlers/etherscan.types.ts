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
