import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, RotateCw, CheckCircle2, Award } from 'lucide-react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ScratchCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (coins: number) => void;
}

export const ScratchCardModal: React.FC<ScratchCardModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rewardAmount, setRewardAmount] = useState<number>(15);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize new card
  const initCard = () => {
    // Random coins between 10 and 25
    const randomReward = Math.floor(Math.random() * 16) + 10;
    setRewardAmount(randomReward);
    setIsScratched(false);
    setScratchPercent(0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw silver/gold scratchable coating
    ctx.globalCompositeOperation = 'source-over';
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#5A6275');
    gradient.addColorStop(0.5, '#7F8A9F');
    gradient.addColorStop(1, '#4A5263');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative pattern on foil
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE ✨', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '12px sans-serif';
    ctx.fillText('Rub with finger or mouse', canvas.width / 2, canvas.height / 2 + 15);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(initCard, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Scratch action
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2, false);
    ctx.fill();

    // Check completion progress
    checkScratchProgress();
  };

  const checkScratchProgress = () => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparentPixels = 0;
      const totalPixels = imgData.data.length / 4;

      // Sample every 8th pixel for quick performance
      for (let i = 3; i < imgData.data.length; i += 32) {
        if (imgData.data[i] === 0) {
          transparentPixels += 8;
        }
      }

      const percent = Math.min(100, Math.round((transparentPixels / totalPixels) * 100));
      setScratchPercent(percent);

      if (percent > 40 && !isScratched) {
        setIsScratched(true);
        sounds.playSuccess();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch {
      // Fallback
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDrawing(true);
    const touch = e.touches[0];
    if (touch) scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing) return;
    const touch = e.touches[0];
    if (touch) scratch(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  // Instant scratch helper button
  const handleInstantReveal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsScratched(true);
    setScratchPercent(100);
    sounds.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleClaim = () => {
    onRewardClaimed(rewardAmount);
    sounds.playCoin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="modal-scratch-card"
        className="w-full max-w-sm bg-[#151821] border border-white/10 rounded-[28px] p-6 shadow-2xl relative text-white space-y-4"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-xl">
            🎟️
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Lucky Scratch Card</h3>
            <p className="text-xs text-amber-400 font-semibold">Scratch & win up to 25 Coins!</p>
          </div>
        </div>

        {/* Scratch Area */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[#231A33] via-[#1A2234] to-[#121622] border border-white/10 flex items-center justify-center select-none shadow-inner">
          {/* Underneath Revealed Reward */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-1">
            <span className="text-3xl animate-bounce">🪙</span>
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
              Congratulations!
            </span>
            <span className="text-3xl font-black text-amber-400 drop-shadow">
              +{rewardAmount} Coins
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Ready to Claim
            </span>
          </div>

          {/* Foreground Scratch Canvas */}
          <canvas
            ref={canvasRef}
            width={320}
            height={192}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-300 ${
              isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
        </div>

        {/* Progress or Actions */}
        <div className="space-y-2">
          {!isScratched ? (
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Scratched: {scratchPercent}%</span>
              <button
                type="button"
                onClick={handleInstantReveal}
                className="text-amber-400 hover:text-amber-300 text-xs font-bold underline cursor-pointer"
              >
                Auto Reveal
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleClaim}
              className="w-full h-12 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20 transition-all animate-pulse"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>CLAIM +{rewardAmount} COINS</span>
            </button>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={initCard}
              className="flex-1 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>New Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
