import React from 'react';

interface InsightPopupProps {
  open: boolean;
  onClose: () => void;
  data: { title: string; message: string; icon?: string };
}

export default function InsightPopup({ open, onClose, data }: InsightPopupProps) {
  return (
    <div
      className={`fixed bottom-8 left-0 z-50 transition-transform duration-500 ${open ? 'translate-x-0' : '-translate-x-full'} w-80 max-w-full`}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      <div className="bg-gradient-to-r from-[#232323] to-[#1D1616] border-l-4 border-[#D84040] shadow-xl rounded-r-lg p-6 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          {data.icon && <span className="text-2xl">{data.icon}</span>}
          <span className="font-bold text-lg text-[#D84040]">{data.title}</span>
        </div>
        <div className="text-gray-200 text-sm mb-2">{data.message}</div>
        <button
          onClick={onClose}
          className="self-end text-xs text-gray-400 hover:text-[#D84040] mt-2"
        >
          Close
        </button>
      </div>
    </div>
  );
} 