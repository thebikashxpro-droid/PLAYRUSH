import React from 'react';
import { Home, Gamepad2, Wallet, User } from 'lucide-react';

interface BottomNavProps {
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  selectedIndex,
  onSelectIndex,
}) => {
  const items = [
    { label: 'Home', icon: Home, id: 'nav-home' },
    { label: 'Games', icon: Gamepad2, id: 'nav-games' },
    { label: 'Wallet', icon: Wallet, id: 'nav-wallet' },
    { label: 'Profile', icon: User, id: 'nav-profile' },
  ];

  return (
    <nav
      id="playrush-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-[#0F1117] border-t border-white/[0.06] backdrop-blur-lg"
    >
      <div className="px-[18px] pt-[10px] pb-[10px] flex items-center justify-around">
        {items.map((item, index) => {
          const selected = selectedIndex === index;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              id={item.id}
              type="button"
              onClick={() => onSelectIndex(index)}
              className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer rounded-[14px] px-[15px] py-[6px] ${
                selected
                  ? 'bg-white/[0.08] text-white'
                  : 'bg-transparent text-white/45 hover:text-white/70'
              }`}
            >
              <Icon
                className={`w-[20px] h-[20px] transition-transform ${
                  selected ? 'scale-105 text-white' : ''
                }`}
                strokeWidth={selected ? 2.3 : 1.8}
              />
              <span
                className={`text-[11px] mt-1 font-semibold tracking-tight transition-colors ${
                  selected ? 'text-white' : 'text-white/45'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
