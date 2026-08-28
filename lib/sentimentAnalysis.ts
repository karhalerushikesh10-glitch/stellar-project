export type NetworkSentiment = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'CONGESTED';

export interface SentimentData {
  sentiment: NetworkSentiment;
  confidence: number;
  recommendedBaseFee: number;
  congestionIndex: number; // 0 to 1
}

/**
 * Mocks fetching real-time on-chain data to compute a network sentiment score
 * and dynamically suggest transaction gas base fees.
 */
export const getNetworkSentiment = async (): Promise<SentimentData> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // In a real implementation, this would aggregate recent ledger close times,
  // mempool size, and soroban event density.
  const mockCongestion = Math.random(); 
  
  let sentiment: NetworkSentiment = 'NEUTRAL';
  let baseFee = 100;

  if (mockCongestion > 0.8) {
    sentiment = 'CONGESTED';
    baseFee = 5000;
  } else if (mockCongestion < 0.2) {
    sentiment = 'BULLISH';
    baseFee = 100;
  } else if (mockCongestion > 0.5) {
    sentiment = 'BEARISH';
    baseFee = 1000;
  }

  return {
    sentiment,
    confidence: Number((Math.random() * 20 + 80).toFixed(2)),
    recommendedBaseFee: baseFee,
    congestionIndex: mockCongestion,
  };
};