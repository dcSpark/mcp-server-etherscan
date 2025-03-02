import { ToolResultSchema } from "../types.js";

/**
 * Utility function to create an error response
 * @param message The error message
 * @returns A ToolResultSchema with the error message
 */
export const createErrorResponse = <T>(message: string): ToolResultSchema<T> => {
  return {
    content: [{
      type: "text",
      text: message
    }],
    isError: true
  };
};

/**
 * Utility function to create a success response
 * @param message The success message
 * @returns A ToolResultSchema with the success message
 */
export const createSuccessResponse = <T>(message: string): ToolResultSchema<T> => {
  return {
    content: [{
      type: "text",
      text: message
    }],
    isError: false
  };
};

/**
 * Utility function to validate an Ethereum address
 * @param address The Ethereum address to validate
 * @returns True if the address is valid, false otherwise
 */
export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Utility function to validate an Ethereum address and return an error response if invalid
 * @param address The Ethereum address to validate
 * @returns Either true or a ToolResultSchema with an error message
 */
export const validateEthereumAddress = <T>(address: string): true | ToolResultSchema<T> => {
  if (!isValidEthereumAddress(address)) {
    return createErrorResponse<T>(`Invalid Ethereum address: ${address}`);
  }
  return true;
};
