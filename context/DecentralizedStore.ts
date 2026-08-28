type Listener<T> = (val: T) => void;

export class Atom<T> {
  private value: T;
  private listeners: Set<Listener<T>> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T | ((prev: T) => T)): void {
    if (typeof newValue === 'function') {
      this.value = (newValue as (prev: T) => T)(this.value);
    } else {
      this.value = newValue;
    }
    this.notify();
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.value);
    }
  }
}

// Decentralized store instances for the wallet context
export const walletAddressAtom = new Atom<string | null>(null);
export const isWalletConnectingAtom = new Atom<boolean>(false);
export const stellarNetworkAtom = new Atom<'public' | 'testnet' | 'futurenet'>('testnet');
export const balancesAtom = new Atom<Record<string, string>>({});