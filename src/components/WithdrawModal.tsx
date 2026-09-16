import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  initialMethod?: 'googleplay' | 'upi';
  onConfirmWithdraw: (
    pointsToWithdraw: number,
    inrAmount: number,
    method: string,
    accountDetails: string,
    generatedCode?: string
  ) => void;
}

function generateGooglePlayCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const pick = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${pick(4)}-${pick(4)}-${pick(4)}-${pick(4)}`;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  points,
  initialMethod = 'googleplay',
  onConfirmWithdraw,
}) => {
  const [method, setMethod] = useState<'googleplay' | 'upi'>('googleplay');
  const [accountInput, setAccountInput] = useState('');
  const [selectedInr, setSelectedInr] = useState<number>(25);
  const [customInr, setCustomInr] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastTxId, setLastTxId] = useState('');
  const [generatedPlayCode, setGeneratedPlayCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialMethod) {
        setMethod(initialMethod);
      }
    }
  }, [isOpen, initialMethod]);

  if (!isOpen) return null;

  const currentMaxInr = Math.floor(points / 100);
  const activeInr = customInr ? Number(customInr) : selectedInr;
  const neededPoints = activeInr * 100;

  const handleWithdraw = () => {
    setErrorMessage('');

    // For Google Play, email is optional, defaults to instant in-app delivery
    const effectiveRecipient =
      method === 'googleplay'
        ? accountInput.trim() || 'Instant In-App Delivery'
        : accountInput.trim();

    if (method === 'upi' && !accountInput.trim()) {
      setErrorMessage('Please enter your valid UPI ID (e.g. yourname@oksbi or 9876543210@upi)');
      return;
    }

    if (activeInr < 10) {
      setErrorMessage('Minimum withdrawal amount is ₹10 (1,000 Points).');
      return;
    }

    if (points < neededPoints) {
      setErrorMessage(`Insufficient points. You need ${neededPoints.toLocaleString()} points for ₹${activeInr}.`);
      return;
    }

    setIsProcessing(true);
    sounds.playClick();

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const txId = 'TXN' + Math.floor(100000 + Math.random() * 900000);
      setLastTxId(txId);

      let playCode = '';
      if (method === 'googleplay') {
        playCode = generateGooglePlayCode();
        setGeneratedPlayCode(playCode);
      }

      sounds.playSuccess();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      onConfirmWithdraw(
        neededPoints,
        activeInr,
        method === 'googleplay' ? 'GOOGLE PLAY' : method.toUpperCase(),
        effectiveRecipient,
        playCode
      );
    }, 1200);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    sounds.playCoin();
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    setGeneratedPlayCode('');
    setCodeCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="modal-withdraw"
        className="w-full max-w-md bg-[#151821] border border-white/10 rounded-[24px] p-6 shadow-2xl relative text-white overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">
                {method === 'googleplay' ? 'Google Play Code Ready!' : 'Withdrawal Initiated!'}
              </h3>
              <p className="text-white/60 text-xs mt-1">
                ₹{activeInr}.00 ({neededPoints.toLocaleString()} Points) redeemed successfully.
              </p>
            </div>

            {/* If Google Play: Show Authentic Voucher Box */}
            {method === 'googleplay' && generatedPlayCode && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#122A21] via-[#151F2A] to-[#1E1929] border border-emerald-500/30 text-left space-y-3 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                      <span className="text-base">▶️</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-1">
                        Google Play Redeem Code
                      </h4>
                      <p className="text-[10px] text-emerald-400 font-semibold">Instant Digital Voucher</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400">₹{activeInr}</span>
                  </div>
                </div>

                {/* Redeem Code Display */}
                <div className="bg-black/60 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div className="font-mono text-sm font-black tracking-wider text-emerald-300 select-all">
                    {generatedPlayCode}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(generatedPlayCode)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
                  >
                    {codeCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-white/[0.04] rounded-xl p-3 text-[11px] text-white/70 space-y-1 border border-white/5">
                  <p className="font-bold text-white text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> How to Redeem:
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-white/60">
                    <li>Open <strong>Google Play Store</strong> app on your Android device.</li>
                    <li>Tap your <strong>Profile Icon</strong> at the top right.</li>
                    <li>Select <strong>Payments & subscriptions</strong> → <strong>Redeem code</strong>.</li>
                    <li>Paste your 16-character code and tap <strong>Redeem</strong>.</li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://play.google.com/redeem?code=${generatedPlayCode.replace(/-/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-center border border-white/10"
                  >
                    <span>Open Play Store</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/60" />
                  </a>
                </div>
              </div>
            )}

            <div className="bg-[#1D2230] rounded-xl p-4 border border-white/5 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-white/50">Transaction ID</span>
                <span className="font-mono font-bold text-white">{lastTxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Payout Method</span>
                <span className="font-bold text-white uppercase">{method === 'googleplay' ? 'Google Play Gift Code' : method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Recipient / Delivery</span>
                <span className="font-medium text-white">{accountInput.trim() || 'Direct In-App Delivery'}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/5">
                <span className="text-white/50">Status</span>
                <span className="font-bold text-emerald-400">
                  {method === 'googleplay' ? 'Generated & Saved in Wallet' : 'Instant Processing'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full h-12 bg-white text-black font-extrabold text-sm rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer mt-2"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                Withdraw & Redeem <span className="text-sm font-normal text-white/50">(₹ INR)</span>
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Balance: {points.toLocaleString()} Points (≈ ₹{(points / 100).toFixed(2)})
              </p>
            </div>

            {/* Select Method */}
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-2">
                Redemption Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'googleplay', label: 'Google Play Redeem Code', icon: '▶️', highlight: true },
                  { id: 'upi', label: 'UPI (GPay / PhonePe)', icon: '⚡' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMethod(item.id as 'googleplay' | 'upi');
                      if (item.id === 'googleplay') {
                        setSelectedInr(25);
                      }
                      setErrorMessage('');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-2 ${
                      method === item.id
                        ? item.id === 'googleplay'
                          ? 'bg-emerald-400 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-white text-black border-white shadow-md'
                        : item.id === 'googleplay'
                        ? 'bg-[#182822] text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50'
                        : 'bg-[#1D2230] text-white/60 border-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-sm leading-none">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Google Play Special Highlight Banner */}
            {method === 'googleplay' && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-transparent border border-emerald-500/20 flex items-start gap-2.5">
                <span className="text-lg">🎁</span>
                <div className="text-xs">
                  <p className="font-bold text-white">Google Play Store Gift Code</p>
                  <p className="text-white/60 text-[11px] mt-0.5">
                    Instant 16-character digital code for games (Free Fire, BGMI, Clash of Clans), apps & in-app purchases.
                  </p>
                </div>
              </div>
            )}

            {/* Account Details Input */}
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1.5">
                {method === 'googleplay'
                  ? 'Google Account / Email (Optional for receipt)'
                  : 'Enter UPI ID (GPay / PhonePe)'}
              </label>
              <input
                type="text"
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                placeholder={
                  method === 'googleplay'
                    ? 'e.g. gamer@gmail.com (or leave empty for instant in-app)'
                    : 'e.g. name@oksbi or 9876543210@upi'
                }
                className="w-full bg-[#1A1F2C] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {/* Amount Selection */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-white/70">
                  Select {method === 'googleplay' ? 'Voucher' : 'Cash'} Amount
                </label>
                <span className="text-[11px] text-white/40">
                  Cost: {neededPoints.toLocaleString()} Pts
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(method === 'googleplay' ? [10, 25, 50, 100] : [10, 20, 50, 100]).map((amt) => {
                  const ptsCost = amt * 100;
                  const canAfford = points >= ptsCost;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedInr(amt);
                        setCustomInr('');
                        setErrorMessage('');
                      }}
                      className={`py-2 px-1 rounded-xl text-center transition-all border cursor-pointer ${
                        selectedInr === amt && !customInr
                          ? method === 'googleplay'
                            ? 'bg-emerald-400 text-black border-emerald-400 font-extrabold shadow-md'
                            : 'bg-amber-400 text-black border-amber-400 font-extrabold shadow-md'
                          : 'bg-[#1D2230] text-white border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="text-xs font-bold">₹{amt}</div>
                      <div
                        className={`text-[9px] ${
                          selectedInr === amt && !customInr
                            ? 'text-black/70'
                            : canAfford
                            ? 'text-white/40'
                            : 'text-red-400'
                        }`}
                      >
                        {ptsCost.toLocaleString()} pts
                      </div>
                    </button>
                  );
                })}
              </div>

              {currentMaxInr > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedInr(currentMaxInr);
                    setCustomInr('');
                  }}
                  className="mt-2 w-full text-[11px] text-amber-400/90 hover:text-amber-300 text-right underline cursor-pointer"
                >
                  Withdraw maximum (₹{currentMaxInr})
                </button>
              )}
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-white/40 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                {method === 'googleplay'
                  ? 'Instant code generation. 100% genuine Google Play codes.'
                  : 'Safe & instant payment verified via PlayRush Secure Gateway.'}
              </span>
            </div>

            {/* Action button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleWithdraw}
              className={`w-full h-12 active:scale-[0.98] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                method === 'googleplay'
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-lg shadow-emerald-500/10'
                  : 'bg-white hover:bg-neutral-200 text-black'
              }`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {method === 'googleplay'
                      ? `GET ₹${activeInr} GOOGLE PLAY CODE`
                      : `CONFIRM WITHDRAWAL OF ₹${activeInr}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

