import React from 'react';
import { PlusCircle, Puzzle, Gamepad2, Zap } from 'lucide-react';
import { GameItem } from '../types';

interface GameCardsProps {
  onPlayGame: (game: GameItem) => void;
}

export const initialGames: GameItem[] = [
  {
    id: 'game-puzzle',
    title: 'Puzzle',
    subtitle: 'Quick games',
    reward: 50,
    iconName: 'puzzle',
    category: 'Brain',
    difficulty: 'Easy',
    playedCount: 1420,
  },
  {
    id: 'game-arcade',
    title: 'Arcade',
    subtitle: 'Play & earn',
    reward: 75,
    iconName: 'arcade',
    category: 'Action',
    difficulty: 'Medium',
    playedCount: 2890,
  },
  {
    id: 'game-challenge',
    title: 'Challenge',
    subtitle: 'Daily game',
    reward: 100,
    iconName: 'challenge',
    category: 'Special',
    difficulty: 'Hard',
    playedCount: 940,
  },
];

export const GameCards: React.FC<GameCardsProps> = ({ onPlayGame }) => {
  const getIcon = (iconName: GameItem['iconName']) => {
    switch (iconName) {
      case 'puzzle':
        return <Puzzle className="w-[21px] h-[21px] text-white stroke-[2]" />;
      case 'arcade':
        return <Gamepad2 className="w-[21px] h-[21px] text-white stroke-[2]" />;
      case 'challenge':
        return <Zap className="w-[21px] h-[21px] text-amber-300 stroke-[2] fill-amber-400/20" />;
      default:
        return <Gamepad2 className="w-[21px] h-[21px] text-white stroke-[2]" />;
    }
  };

  return (
    <div id="playrush-games-horizontal" className="relative">
      <div className="flex gap-3.5 px-5 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-0.5">
        {initialGames.map((game) => (
          <button
            key={game.id}
            id={`game-card-${game.id}`}
            type="button"
            onClick={() => onPlayGame(game)}
            className="group flex-shrink-0 w-[145px] h-[158px] p-4 rounded-[20px] bg-[#151821] hover:bg-[#1A1F2C] active:scale-[0.96] transition-all duration-200 border border-white/[0.06] hover:border-white/15 flex flex-col justify-between text-left cursor-pointer shadow-lg shadow-black/20 relative overflow-hidden"
          >
            {/* Ambient top highlight */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full blur-xl pointer-events-none group-hover:bg-white/[0.05] transition-all" />

            <div className="w-[42px] h-[42px] rounded-[13px] bg-white/[0.07] group-hover:bg-white/[0.12] flex items-center justify-center transition-colors">
              {getIcon(game.iconName)}
            </div>

            <div className="mt-auto">
              <h3 className="text-[15px] font-extrabold text-white leading-tight">
                {game.title}
              </h3>
              <p className="text-white/40 text-[10px] font-normal mt-0.5">
                {game.subtitle}
              </p>

              <div className="mt-[7px] flex items-center gap-1">
                <PlusCircle className="w-[13px] h-[13px] text-white/55 group-hover:text-amber-400 transition-colors" />
                <span className="text-white/70 text-[10px] font-semibold tracking-tight">
                  +{game.reward} Points
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
