import { Horizon, TransactionBuilder, Asset, Operation, Networks, Memo, Transaction } from "@stellar/stellar-sdk";
import { kit } from "./wallet";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");
const NETWORK_PASSPHRASE = Networks.TESTNET; // "Test SDF Network ; September 2015"

export type TransactionResult = {
  success: boolean;
  hash?: string;
  error?: string;
};

export async function sendXLM(
  sourcePublicKey: string,
  destination: string,
  amount: string,
  memo?: string
): Promise<TransactionResult> {
  try {
    const account = await server.loadAccount(sourcePublicKey);
    
    // Hardcode a default base fee or fetch it. We will use a fallback here.
    const baseFee = await server.feeStats().then(s => s.fee_charged.max).catch(() => "1000");

    let builder = new TransactionBuilder(account, {
      fee: baseFee,
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    
    builder = builder.addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount: amount,
      })
    );

    if (memo) {
      builder = builder.addMemo(Memo.text(memo));
    }

    builder = builder.setTimeout(30);
    
    const transaction = builder.build();

    const signedRes = await kit.signTransaction(transaction.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE
    });
    
    // Kit typically returns `{ signedTxXdr: string }` or `{ result: string }` or just string
    let signedXDR = "";
    if (typeof signedRes === "string") {
      signedXDR = signedRes;
    } else if (signedRes && "signedTxXdr" in signedRes) {
      signedXDR = signedRes.signedTxXdr as string;
    } else if (signedRes && "result" in signedRes) {
      signedXDR = (signedRes as any).result;
    } else {
       throw new Error("Invalid signature response from wallet");
    }

    const signedTransaction = TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE) as Transaction;
    const result = await server.submitTransaction(signedTransaction);

    return {
      success: true,
      hash: result.hash,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Transaction failed",
    };
  }
}
