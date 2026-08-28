# Neural Intent Engine API

## Overview
The Neural Intent Engine provides predictive analysis for Soroban smart contract transactions, estimating the success rate and gas costs prior to user signatures.

## Core Hooks

### `useNeuralPrediction(transaction: string)`
React hook that initiates a background simulation of the transaction against the current ledger state.

**Parameters:**
- `transaction` (string): The base64-encoded XDR transaction envelope.

**Returns:**
- `isAnalyzing` (boolean): True while the simulation is running.
- `prediction` (Object | null):
  - `confidence` (number): 0-100 score indicating success likelihood.
  - `estFee` (string): Estimated XLM cost.
  - `status` (string): Human readable outcome (e.g. "High Success Probability").

## Usage Example
```tsx
import { useNeuralPrediction } from '@/hooks/useNeuralPrediction';

const PredictionCard = ({ txXdr }) => {
  const { isAnalyzing, prediction } = useNeuralPrediction(txXdr);

  if (isAnalyzing) return <div>Simulating neural paths...</div>;
  
  return (
    <div>
      <p>Confidence: {prediction?.confidence}%</p>
      <p>Est. Fee: {prediction?.estFee}</p>
    </div>
  );
};
```