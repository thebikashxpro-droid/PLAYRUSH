import React from 'react';

interface SectionHeaderProps {
  title: string;
  actionText: string;
  onAction: () => void;
  id?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onAction,
  id,
}) => {
  return (
    <div id={id} className="px-5 pt-7 pb-3.5 flex items-center justify-between">
      <h2 className="text-[18px] font-extrabold text-white tracking-tight">
        {title}
      </h2>
      <button
        type="button"
        onClick={onAction}
        className="text-white/55 hover:text-white text-[12px] font-semibold transition-colors cursor-pointer"
      >
        {actionText}
      </button>
    </div>
  );
};
