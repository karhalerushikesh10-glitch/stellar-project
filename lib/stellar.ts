import { Horizon } from "@stellar/stellar-sdk";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export async function getXLMBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find((b) => b.asset_type === "native");
    if (!nativeBalance) return "0.0000";
    return parseFloat(nativeBalance.balance).toFixed(4);
  } catch (error: any) {
    // Horizon returns 404 for unfunded accounts
    if (error?.response?.status === 404) {
      return "0.0000";
    }
    console.error("Error fetching balance:", error);
    return "0.0000"; 
  }
}
