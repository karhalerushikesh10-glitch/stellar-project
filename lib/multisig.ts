import { Keypair, Transaction, xdr } from '@stellar/stellar-sdk';

export interface SignaturePayload {
  publicKey: string;
  signature: Buffer;
}

export class MultiSigWallet {
  public signers: Map<string, number> = new Map();
  public threshold: number;
  public networkPassphrase: string;
  private collectedSignatures: SignaturePayload[] = [];

  constructor(threshold: number, networkPassphrase: string) {
    this.threshold = threshold;
    this.networkPassphrase = networkPassphrase;
  }

  addSigner(publicKey: string, weight: number) {
    if (weight <= 0) throw new Error('Weight must be positive');
    this.signers.set(publicKey, weight);
  }

  removeSigner(publicKey: string) {
    this.signers.delete(publicKey);
  }

  addSignature(publicKey: string, signature: Buffer) {
    if (!this.signers.has(publicKey)) {
      throw new Error(`Signer ${publicKey} is not authorized for this wallet.`);
    }
    // Prevent duplicate signatures
    if (this.collectedSignatures.find(sig => sig.publicKey === publicKey)) {
      throw new Error(`Signer ${publicKey} has already signed.`);
    }
    this.collectedSignatures.push({ publicKey, signature });
  }

  verifyThreshold(): boolean {
    let currentWeight = 0;
    for (const sig of this.collectedSignatures) {
      currentWeight += this.signers.get(sig.publicKey) || 0;
    }
    return currentWeight >= this.threshold;
  }

  attachSignaturesToTransaction(transaction: Transaction): Transaction {
    if (!this.verifyThreshold()) {
      throw new Error(`Insufficient signature weight. Need ${this.threshold}, have ${this.getCurrentWeight()}`);
    }

    // Attach signatures to the transaction
    for (const payload of this.collectedSignatures) {
      const keypair = Keypair.fromPublicKey(payload.publicKey);
      const decoratedSignature = new xdr.DecoratedSignature({
        hint: keypair.signatureHint(),
        signature: payload.signature,
      });
      transaction.signatures.push(decoratedSignature);
    }

    return transaction;
  }

  getCurrentWeight(): number {
    return this.collectedSignatures.reduce((total, sig) => {
      return total + (this.signers.get(sig.publicKey) || 0);
    }, 0);
  }
}