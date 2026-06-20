import { WalletButton } from "@/components/WalletButton";
import { BalanceCard } from "@/components/BalanceCard";
import { FaucetButton } from "@/components/FaucetButton";
import { SendPayment } from "@/components/SendPayment";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900">StellarPay Simple</h1>
        <div className="flex justify-center">
          <WalletButton />
        </div>
        <BalanceCard />
        <FaucetButton />
        <SendPayment />
      </div>
    </main>
  );
}
