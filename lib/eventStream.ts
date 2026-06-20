import { SorobanRpc } from "@stellar/stellar-sdk";

const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC || "https://soroban-testnet.stellar.org:443";
const server = new SorobanRpc.Server(rpcUrl);

export async function fetchContractEvents(contractIds: string[], startLedger: number) {
  if (!contractIds || contractIds.length === 0) return [];
  
  try {
    const response = await server.getEvents({
      startLedger,
      filters: [
        {
          type: "contract",
          contractIds,
          topics: []
        }
      ],
      limit: 50
    });
    return response.events || [];
  } catch (e) {
    console.error("fetch events error", e);
    return [];
  }
}

export async function getLatestLedger(): Promise<number> {
  try {
    const info = await server.getLatestLedger();
    return info.sequence;
  } catch (e) {
    return 0;
  }
}
