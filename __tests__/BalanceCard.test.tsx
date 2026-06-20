import { render, screen, waitFor } from '@testing-library/react';
import { BalanceCard } from '../components/BalanceCard';
import { useWallet } from '../context/WalletContext';
import { getXLMBalance } from '../lib/stellar';

jest.mock('../context/WalletContext', () => ({
  useWallet: jest.fn()
}));

jest.mock('../lib/stellar', () => ({
  getXLMBalance: jest.fn()
}));

describe('BalanceCard', () => {
  it('Component renders the balance correctly', async () => {
    (useWallet as jest.Mock).mockReturnValue({ publicKey: 'GAAA', refreshTrigger: 0 });
    (getXLMBalance as jest.Mock).mockResolvedValue('123.4567');
    
    render(<BalanceCard />);
    
    await waitFor(() => {
      expect(screen.getByText('123.4567 XLM')).toBeInTheDocument();
    });
  });

  it('Refresh triggers on context change', async () => {
    (useWallet as jest.Mock).mockReturnValue({ publicKey: 'GAAA', refreshTrigger: 1 });
    (getXLMBalance as jest.Mock).mockResolvedValue('999.0000');
    
    render(<BalanceCard />);
    
    await waitFor(() => {
      expect(screen.getByText('999.0000 XLM')).toBeInTheDocument();
    });
  });
});
