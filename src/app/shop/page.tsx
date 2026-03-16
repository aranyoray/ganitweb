'use client';

import { useState } from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import NavHeader from '@/components/NavHeader';

const SHOP_ITEMS = [
  { id: 'common', name: 'Common Reward', cost: 25, reward: 50 },
  { id: 'rare', name: 'Rare Reward', cost: 50, reward: 100 },
  { id: 'epic', name: 'Epic Reward', cost: 100, reward: 250 },
  { id: 'mythic', name: 'Mythic Reward', cost: 150, reward: 500 },
  { id: 'legendary', name: 'Legendary Reward', cost: 250, reward: 1000 },
];

export default function ShopPage() {
  const { score, coins, removeScore, addCoins } = useProgress();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleBuy(item: typeof SHOP_ITEMS[number]) {
    if (score < item.cost) return;
    removeScore(item.cost);
    addCoins(item.reward);
    setSuccessMessage(`You got ${item.reward} coins from ${item.name}!`);
    setTimeout(() => setSuccessMessage(null), 2500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-slate-900 text-white">
      <NavHeader title="Shop" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Balance */}
        <div className="flex items-center justify-center gap-6 bg-white/10 rounded-lg px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="text-orange-400">&#9733;</span>
            <span className="text-sm font-semibold text-orange-400">{score} Points</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-yellow-400">&#9679;</span>
            <span className="text-sm font-semibold text-yellow-400">{coins} Coins</span>
          </div>
        </div>

        {/* Purchase feedback */}
        {successMessage && (
          <p className="text-green-400 text-sm font-medium text-center">{successMessage}</p>
        )}

        {/* Shop Items */}
        {SHOP_ITEMS.map((item) => {
          const canAfford = score >= item.cost;
          return (
            <button
              key={item.id}
              onClick={() => handleBuy(item)}
              disabled={!canAfford}
              className={`w-full rounded-lg px-4 py-3 flex items-center justify-between transition ${
                canAfford
                  ? 'bg-blue-500/10 active:scale-[0.98]'
                  : 'bg-white/5 opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-xs text-white/60">
                {item.cost} pts &rarr; {item.reward} coins
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
