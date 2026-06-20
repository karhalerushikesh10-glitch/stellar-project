import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { FreighterModule, FREIGHTER_ID } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { xBullModule, XBULL_ID } from "@creit.tech/stellar-wallets-kit/modules/xbull";
import { AlbedoModule, ALBEDO_ID } from "@creit.tech/stellar-wallets-kit/modules/albedo";
import { WalletNotFoundError } from "./errors";

StellarWalletsKit.init({
  network: "TESTNET" as any,
  selectedWalletId: FREIGHTER_ID,
  modules: [new FreighterModule(), new (xBullModule as any)(), new AlbedoModule()],
});

export const kit = StellarWalletsKit;
export { FREIGHTER_ID, XBULL_ID, ALBEDO_ID };

export type WalletResult = {
  success: boolean;
  publicKey?: string;
  error?: string;
};

export async function connectWallet(walletId: string): Promise<WalletResult> {
  try {
    kit.setWallet(walletId);
    
    // Some wallets (like Albedo) might request network, but kit handles it mostly
    const { address } = await kit.selectedModule.getAddress({ skipRequestAccess: false });
    
    if (!address) {
      throw new WalletNotFoundError();
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("stellar_public_key", address);
      localStorage.setItem("stellar_wallet_id", walletId);
    }
    return { success: true, publicKey: address };
  } catch (error: any) {
    return { 
      success: false, 
      error: error?.message || "Failed to connect wallet" 
    };
  }
}

export function disconnectWallet(): WalletResult {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("stellar_public_key");
      localStorage.removeItem("stellar_wallet_id");
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to disconnect wallet" };
  }
}
