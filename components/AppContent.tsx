import { WalletProvider } from "@/context/WalletContext";
import { WalletButton } from "@/components/WalletButton";
import { BalanceCard } from "@/components/BalanceCard";
import { FaucetButton } from "@/components/FaucetButton";
import { SendPayment } from "@/components/SendPayment";
import { ContractCounter } from "@/components/ContractCounter";
import { PaymentSplitter } from "@/components/PaymentSplitter";
import { ActivityFeed } from "@/components/ActivityFeed";
import { MobileMenu } from "@/components/MobileMenu";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function AppContent() {
  return (
    <ErrorBoundary>
      <WalletProvider>
        <div className="min-h-screen flex flex-col items-center text-[var(--text-primary)]">
          <header className="w-full bg-[rgba(250,248,245,0.85)] backdrop-blur p-4 flex justify-between items-center z-10 sticky top-0 border-b border-[var(--border-soft)]">
            <div className="flex items-center gap-4">
              <MobileMenu />
              <h1 className="text-xl font-bold text-[var(--text-primary)] hidden md:block tracking-wide">StellarPay</h1>
            </div>
            <WalletButton />
          </header>

          <main className="flex-1 w-full max-w-4xl p-4 sm:p-6 grid gap-6 md:grid-cols-2 mt-4">
            <div className="space-y-6">
              <section className="bg-[var(--bg-surface)] border border-[var(--border-soft)] shadow-[0_1px_3px_rgba(43,38,32,0.06)] p-6 rounded-2xl">
                <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Wallet Overview</h2>
                <BalanceCard />
                <div className="mt-4">
                  <FaucetButton />
                </div>
              </section>

              <section className="bg-[var(--bg-surface)] border border-[var(--border-soft)] shadow-[0_1px_3px_rgba(43,38,32,0.06)] p-6 rounded-2xl">
                <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Quick Transfer</h2>
                <SendPayment />
              </section>
            </div>

            <div className="space-y-6">
              <ContractCounter />
              <PaymentSplitter />
            </div>

            <div className="md:col-span-2">
              <ActivityFeed />
            </div>
          </main>
        </div>
      </WalletProvider>
    </ErrorBoundary>
  );
}
