import { rpc, Contract, TransactionBuilder, Networks, xdr, Address } from "@stellar/stellar-sdk";
import { kit } from "./wallet";

const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC || "https://soroban-testnet.stellar.org:443";
const server = new rpc.Server(rpcUrl);
const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET;
const COUNTER_CONTRACT_ID = process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ID || "";
const SPLITTER_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS || "";
const REWARD_ADDRESS = process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS || "";

export async function getCount(): Promise<number> {
  if (!COUNTER_CONTRACT_ID) return 0;
  
  try {
    const contract = new Contract(COUNTER_CONTRACT_ID);
    const source = new Address("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF").toString();
    const account = await server.getAccount(source).catch(() => ({ id: () => source, sequence: "1" } as any));
    
    const tx = new TransactionBuilder(account, { fee: "1000", networkPassphrase: NETWORK_PASSPHRASE })
      .addOperation(contract.call("get_count"))
      .setTimeout(30)
      .build();

    const simulation = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationSuccess(simulation)) {
      const result = simulation.result?.retval;
      if (result && result.switch() === xdr.ScValType.scvU32()) {
          return result.u32();
      }
    }
  } catch(e) {
    console.error("getCount error:", e);
  }
  return 0;
}

export async function callIncrement(publicKey: string): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const account = await server.getAccount(publicKey);
    const contract = new Contract(COUNTER_CONTRACT_ID);
    const callerAddress = new Address(publicKey);
    
    let tx = new TransactionBuilder(account, { fee: "10000", networkPassphrase: NETWORK_PASSPHRASE })
      .addOperation(contract.call("increment", callerAddress.toScVal()))
      .setTimeout(30)
      .build();

    const preparedTx = await server.prepareTransaction(tx);

    const signedRes = await kit.signTransaction(preparedTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
    let signedXDR = "";
    if (typeof signedRes === "string") { signedXDR = signedRes; }
    else if (signedRes && "signedTxXdr" in signedRes) { signedXDR = signedRes.signedTxXdr as string; }
    else if (signedRes && "result" in signedRes) { signedXDR = (signedRes as any).result; }
    else { throw new Error("Invalid signature from wallet"); }

    const signedTransaction = TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE);
    const response = await server.sendTransaction(signedTransaction);

    if (response.status === "ERROR") {
      return { success: false, error: (response as any).errorResultXdr || "RPC Error" };
    }
    return { success: true, hash: response.hash };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to call increment" };
  }
}

export async function callSplitter(publicKey: string, tokenId: string, recipients: string[], totalAmount: number): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const account = await server.getAccount(publicKey);
    const contract = new Contract(SPLITTER_ADDRESS);
    const payer = new Address(publicKey);
    const token = new Address(tokenId);
    const recipientVals = recipients.map(r => new Address(r).toScVal());
    
    // Convert totalAmount to i128 ScVal
    const amountVal = xdr.ScVal.scvI128(new xdr.Int128Parts({
        hi: xdr.Int64.fromString("0"),
        lo: xdr.Uint64.fromString(totalAmount.toString())
    }));

    let tx = new TransactionBuilder(account, { fee: "10000", networkPassphrase: NETWORK_PASSPHRASE })
      .addOperation(contract.call("split_payment", payer.toScVal(), token.toScVal(), xdr.ScVal.scvVec(recipientVals), amountVal))
      .setTimeout(30)
      .build();

    const preparedTx = await server.prepareTransaction(tx);
    const signedRes = await kit.signTransaction(preparedTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
    let signedXDR = "";
    if (typeof signedRes === "string") signedXDR = signedRes;
    else if (signedRes && "signedTxXdr" in signedRes) signedXDR = signedRes.signedTxXdr as string;
    else if (signedRes && "result" in signedRes) signedXDR = (signedRes as any).result;
    
    const response = await server.sendTransaction(TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE));
    if (response.status === "ERROR") return { success: false, error: "RPC Error" };
    return { success: true, hash: response.hash };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to call splitter" };
  }
}

export async function callMintReward(publicKey: string, recipient: string, splitCount: number): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const account = await server.getAccount(publicKey);
    const contract = new Contract(REWARD_ADDRESS);
    const recip = new Address(recipient);
    
    const countVal = xdr.ScVal.scvI128(new xdr.Int128Parts({
        hi: xdr.Int64.fromString("0"),
        lo: xdr.Uint64.fromString(splitCount.toString())
    }));

    let tx = new TransactionBuilder(account, { fee: "10000", networkPassphrase: NETWORK_PASSPHRASE })
      .addOperation(contract.call("mint_reward", recip.toScVal(), countVal))
      .setTimeout(30)
      .build();

    const preparedTx = await server.prepareTransaction(tx);
    const signedRes = await kit.signTransaction(preparedTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
    let signedXDR = "";
    if (typeof signedRes === "string") signedXDR = signedRes;
    else if (signedRes && "signedTxXdr" in signedRes) signedXDR = signedRes.signedTxXdr as string;
    else if (signedRes && "result" in signedRes) signedXDR = (signedRes as any).result;
    
    const response = await server.sendTransaction(TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE));
    if (response.status === "ERROR") return { success: false, error: "RPC Error" };
    return { success: true, hash: response.hash };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to call mint_reward" };
  }
}
