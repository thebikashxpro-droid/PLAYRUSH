import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Calculator,
  Clock,
  Copy,
  Check,
  ExternalLink,
  Gift,
  Sparkles,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { GooglePlayVoucher, TransactionItem } from '../types';
import { sounds } from '../utils/audio';

interface WalletViewProps {
  points: number;
  transactions: TransactionItem[];
  googlePlayVouchers: GooglePlayVoucher[];
  onOpenWithdraw: (defaultMethod?: 'upi' | 'googleplay') => void;
  onRedeemPromoCode: (code: string) => { success: boolean; message: string; points?: number };
}

export const WalletView: React.FC<WalletViewProps> = ({
  points,
  transactions,
  googlePlayVouchers,
  onOpenWithdraw,
  onRedeemPromoCode,
}) => {
  const [calcInput, setCalcInput] = useState<number>(points);
  const [activeTab, setActiveTab] = useState<'history' | 'playcodes'>('history');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  const inrTotal = (points / 100).toFixed(2);
  const totalEarnedPoints = transactions
    .filter((t) => t.type === 'earn' || t.type === 'bonus')
    .reduce((acc, t) => acc + t.points, 2450);

  const totalWithdrawnInr = transactions
    .filter((t) => t.type === 'withdraw')
    .reduce((acc, t) => acc + t.amountInr, 0);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    sounds.playCoin();
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleApplyPromo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promoInput.trim()) return;

    sounds.playClick();
    const result = onRedeemPromoCode(promoInput.trim());
    setPromoMessage({ text: result.message, success: result.success });
    if (result.success) {
      setPromoInput('');
    }
  };

  return (
    <div id="view-wallet" className="px-5 pt-3 pb-28 space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Wallet & Rewards</h2>
        <p className="text-xs text-white/50 mt-0.5">
          Withdraw real cash or redeem instant Google Play gift codes.
        </p>
      </div>

      {/* Main Balance Banner */}
      <div className="p-5 rounded-[24px] bg-gradient-to-br from-[#202532] to-[#12151C] border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/60">Available Balance</span>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
            <span>▶️ Google Play & UPI</span>
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">{points.toLocaleString()}</span>
          <span className="text-xs text-white/50 font-medium">Points</span>
        </div>

        <p className="text-sm font-bold text-amber-400 mt-0.5">
          ≈ ₹{inrTotal} INR
        </p>

        {/* Dual Primary Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onOpenWithdraw('googleplay')}
            className="h-12 rounded-[15px] bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] text-black font-extrabold text-[11px] tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <span className="text-sm">▶️</span>
            <span>GOOGLE PLAY CODE</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenWithdraw('upi')}
            className="h-12 rounded-[15px] bg-white hover:bg-neutral-100 active:scale-[0.98] text-black font-extrabold text-[11px] tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-white/10"
          >
            <Wallet className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>WITHDRAW CASH</span>
          </button>
        </div>
      </div>

      {/* Google Play Redeem Code Feature Spotlight */}
      <div className="p-4 rounded-[20px] bg-gradient-to-r from-[#12241C] to-[#151821] border border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">
            ▶️
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              Google Play Redeem Codes
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                Instant
              </span>
            </h4>
            <p className="text-[11px] text-white/50 mt-0.5">
              Get ₹10, ₹25, ₹50 or ₹100 Google Play vouchers directly.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenWithdraw('googleplay')}
          className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ml-2"
        >
          Get Code
        </button>
      </div>

      {/* Redeem Promo / Gift Code Section */}
      <div className="p-4 rounded-[20px] bg-[#151821] border border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Redeem Code / Voucher
            </h3>
          </div>
          <span className="text-[10px] text-white/40">Enter code for free points</span>
        </div>

        <form onSubmit={handleApplyPromo} className="flex gap-2">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => {
              setPromoInput(e.target.value.toUpperCase());
              setPromoMessage(null);
            }}
            placeholder="e.g. GOOGLEPLAY or RUSH2026"
            className="flex-1 bg-[#1A1F2C] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black font-extrabold text-xs rounded-xl transition-all cursor-pointer"
          >
            Redeem
          </button>
        </form>

        {promoMessage && (
          <div
            className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              promoMessage.success
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {promoMessage.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <Tag className="w-4 h-4 shrink-0" />
            )}
            <span>{promoMessage.text}</span>
          </div>
        )}

        {/* Quick sample codes for testing */}
        <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-white/50">
          <span>Active codes:</span>
          {['GOOGLEPLAY', 'RUSH2026', 'BONUS100'].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setPromoInput(code);
                sounds.playClick();
              }}
              className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white font-mono cursor-pointer transition-colors"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-[20px] bg-[#151821] border border-white/[0.06]">
          <div className="flex items-center gap-2 text-white/50 text-[11px]">
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            <span>Total Points Earned</span>
          </div>
          <div className="text-lg font-black text-white mt-1">
            {totalEarnedPoints.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-[20px] bg-[#151821] border border-white/[0.06]">
          <div className="flex items-center gap-2 text-white/50 text-[11px]">
            <ArrowUpRight className="w-4 h-4 text-blue-400" />
            <span>Total Withdrawn</span>
          </div>
          <div className="text-lg font-black text-white mt-1">
            ₹{totalWithdrawnInr.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Points to INR Quick Converter */}
      <div className="p-4 rounded-[20px] bg-[#151821] border border-white/[0.06] space-y-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Points Converter
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#1A1F2C] border border-white/5 rounded-xl px-3 py-2">
            <label className="text-[10px] text-white/40 block">Points</label>
            <input
              type="number"
              value={calcInput || ''}
              onChange={(e) => setCalcInput(Number(e.target.value))}
              placeholder="100"
              className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
            />
          </div>

          <span className="text-white/40 font-bold text-sm">=</span>

          <div className="flex-1 bg-[#1A1F2C] border border-white/5 rounded-xl px-3 py-2">
            <label className="text-[10px] text-white/40 block">Real Value</label>
            <div className="text-sm font-extrabold text-emerald-400">
              ₹{((calcInput || 0) / 100).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* History & Codes Segmented Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex p-1 bg-[#151821] rounded-xl border border-white/[0.06] gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Activity</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('playcodes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'playcodes'
                  ? 'bg-emerald-400 text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>▶️ Google Play Codes</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === 'playcodes' ? 'bg-black text-white' : 'bg-white/10 text-white/70'
                }`}
              >
                {googlePlayVouchers.length}
              </span>
            </button>
          </div>

          <span className="text-[11px] text-white/40">
            {activeTab === 'history'
              ? `${transactions.length} items`
              : `${googlePlayVouchers.length} codes`}
          </span>
        </div>

        {/* Tab 1: Google Play Codes Vault */}
        {activeTab === 'playcodes' && (
          <div className="space-y-3">
            {googlePlayVouchers.length === 0 ? (
              <div className="p-6 rounded-[20px] bg-[#151821] text-center border border-white/5 space-y-3">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-xl">
                  ▶️
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">No Google Play Codes Yet</h4>
                  <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">
                    Redeem your game points for instant ₹10, ₹25, ₹50, or ₹100 Google Play redeem codes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenWithdraw('googleplay')}
                  className="px-4 py-2 bg-emerald-400 text-black font-extrabold text-xs rounded-xl hover:bg-emerald-300 transition-colors cursor-pointer"
                >
                  Get Your First Code
                </button>
              </div>
            ) : (
              googlePlayVouchers.map((voucher) => {
                const isCopied = copiedCodeId === voucher.id;
                return (
                  <div
                    key={voucher.id}
                    className="p-4 rounded-[20px] bg-gradient-to-br from-[#122A21] via-[#151821] to-[#12151C] border border-emerald-500/30 space-y-3 relative overflow-hidden shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm">
                          ▶️
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white flex items-center gap-1">
                            ₹{voucher.amountInr} Google Play Gift Code
                          </h4>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            {voucher.date}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {voucher.status}
                      </span>
                    </div>

                    {/* Voucher Code & Action */}
                    <div className="bg-black/60 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2">
                      <div className="font-mono text-xs font-black text-emerald-300 tracking-wider select-all pl-1">
                        {voucher.code}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(voucher.code, voucher.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>COPY</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`https://play.google.com/redeem?code=${voucher.code.replace(/-/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                          title="Open Google Play Store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Activity List */}
        {activeTab === 'history' && (
          <div className="space-y-2">
            {transactions.length === 0 ? (
              <div className="p-6 rounded-[20px] bg-[#151821] text-center text-xs text-white/40">
                No transactions yet. Play games to earn points!
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-[18px] bg-[#151821] border border-white/[0.04] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs ${
                        tx.type === 'withdraw'
                          ? tx.title.toLowerCase().includes('google play')
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-blue-500/10 text-blue-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {tx.type === 'withdraw' ? (
                        tx.title.toLowerCase().includes('google play') ? (
                          <span>▶️</span>
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{tx.title}</h4>
                      <p className="text-[10px] text-white/40 mt-0.5">{tx.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-black block ${
                        tx.type === 'withdraw' ? 'text-white' : 'text-emerald-400'
                      }`}
                    >
                      {tx.type === 'withdraw'
                        ? `-₹${tx.amountInr.toFixed(2)}`
                        : `+${tx.points} pts`}
                    </span>
                    <span className="text-[10px] text-white/40 font-medium">
                      {tx.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

