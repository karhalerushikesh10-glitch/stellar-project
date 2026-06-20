export class WalletNotFoundError extends Error {
  constructor(message = "Wallet not found. Please install a compatible wallet.") {
    super(message);
    this.name = "WalletNotFoundError";
  }
}

export class UserRejectedError extends Error {
  constructor(message = "User rejected the request.") {
    super(message);
    this.name = "UserRejectedError";
  }
}

export class InsufficientBalanceError extends Error {
  constructor(message = "Insufficient balance for this transaction.") {
    super(message);
    this.name = "InsufficientBalanceError";
  }
}

export function parseHorizonError(error: any): string {
  if (
    error instanceof UserRejectedError || 
    error instanceof WalletNotFoundError || 
    error instanceof InsufficientBalanceError
  ) {
    return error.message;
  }

  const resultCodes = error?.response?.data?.extras?.result_codes || error?.response?.extras?.result_codes;
  if (!resultCodes) {
    return error?.message || "An unknown error occurred.";
  }

  const txCode = resultCodes.transaction;
  const opCodes = resultCodes.operations || [];

  if (txCode === "tx_bad_auth") return "Transaction authentication failed. Bad signature.";
  if (txCode === "tx_insufficient_fee") return "Insufficient fee provided for the transaction.";
  
  if (opCodes.includes("op_underfunded")) return "Account is underfunded for this operation.";
  if (opCodes.includes("op_no_destination")) return "Destination account does not exist.";

  return `Transaction failed with codes: ${txCode} / ${opCodes.join(", ")}`;
}
