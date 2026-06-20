import { getXLMBalance, isValidStellarAddress, fundTestnetAccount } from '../lib/stellar';
import { Horizon } from '@stellar/stellar-sdk';

jest.mock('@stellar/stellar-sdk', () => {
  return {
    Horizon: {
      Server: jest.fn().mockImplementation(() => ({
        loadAccount: jest.fn().mockImplementation(async (pubkey) => {
          if (pubkey === 'FUNDED') {
            return {
              balances: [{ asset_type: 'native', balance: '100.5000000' }]
            };
          }
          if (pubkey === 'UNFUNDED') {
            throw { response: { status: 404 } };
          }
          throw new Error('Other error');
        })
      }))
    }
  };
});

global.fetch = jest.fn() as any;

describe('stellar.ts', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('getXLMBalance returns correct format for funded accounts', async () => {
    const bal = await getXLMBalance('FUNDED');
    expect(bal).toBe('100.5000');
  });

  it('getXLMBalance returns correct format for unfunded accounts', async () => {
    const bal = await getXLMBalance('UNFUNDED');
    expect(bal).toBe('0.0000');
  });

  it('isValidStellarAddress correctly validates/rejects addresses', () => {
    expect(isValidStellarAddress('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF')).toBe(true);
    expect(isValidStellarAddress('INVALID')).toBe(false);
  });

  it('fundTestnetAccount handles success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    const success = await fundTestnetAccount('GAAA');
    expect(success).toBe(true);
  });

  it('fundTestnetAccount handles failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    const success = await fundTestnetAccount('GAAA');
    expect(success).toBe(false);
  });
});
