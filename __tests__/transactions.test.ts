import { WalletNotFoundError, UserRejectedError, InsufficientBalanceError, parseHorizonError } from '../lib/errors';

describe('transactions error handling', () => {
  it('All 3 error classes have correct names and messages', () => {
    const e1 = new WalletNotFoundError();
    expect(e1.name).toBe('WalletNotFoundError');
    expect(e1.message).toMatch(/Wallet not found/);

    const e2 = new UserRejectedError();
    expect(e2.name).toBe('UserRejectedError');
    expect(e2.message).toMatch(/User rejected/);

    const e3 = new InsufficientBalanceError();
    expect(e3.name).toBe('InsufficientBalanceError');
    expect(e3.message).toMatch(/Insufficient balance/);
  });

  it('parseHorizonError correctly maps known Horizon result codes', () => {
    expect(parseHorizonError(new UserRejectedError())).toMatch(/User rejected/);
    
    expect(parseHorizonError({ response: { data: { extras: { result_codes: { transaction: 'tx_bad_auth' } } } } })).toMatch(/Transaction authentication failed/);
    expect(parseHorizonError({ response: { data: { extras: { result_codes: { transaction: 'tx_insufficient_fee' } } } } })).toMatch(/Insufficient fee provided/);
    
    expect(parseHorizonError({ response: { data: { extras: { result_codes: { operations: ['op_underfunded'] } } } } })).toMatch(/Account is underfunded/);
    expect(parseHorizonError({ response: { data: { extras: { result_codes: { operations: ['op_no_destination'] } } } } })).toMatch(/Destination account does not exist/);
  });
});
