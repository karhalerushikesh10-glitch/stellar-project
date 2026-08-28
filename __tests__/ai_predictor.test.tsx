import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AITransactionPredictor } from '../components/AITransactionPredictor';

describe('AITransactionPredictor', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders awaiting state when no parameters are provided', () => {
    render(<AITransactionPredictor />);
    expect(screen.getByText(/Awaiting transaction parameters/i)).toBeIn随后Document();
  });

  it('transitions from analyzing to prediction state', async () => {
    render(<AITransactionPredictor targetAddress="GABCD..." amount="100" />);
    
    // Initial analyzing state
    expect(screen.getByText(/Simulating Soroban state execution/i)).toBeInTheDocument();
    
    // Fast-forward timers by 1500ms
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    // Should now show the prediction
    expect(screen.queryByText(/Simulating Soroban state execution/i)).not.toBeInTheDocument();
    expect(screen.getByText(/99.4%/i)).toBeInTheDocument();
    expect(screen.getByText(/0.00001 XLM/i)).toBeInTheDocument();
  });
});