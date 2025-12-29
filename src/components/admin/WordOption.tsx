'use client';

interface WordOptionProps {
  word: string;
  isSelected: boolean;
  onSelect: (word: string) => void;
}

export default function WordOption({
  word,
  isSelected,
  onSelect,
}: WordOptionProps) {
  return (
    <button
      onClick={() => onSelect(word)}
      className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'border-[#7C3AED] bg-white text-[#7C3AED] shadow-sm ring-1 ring-[#7C3AED]/20'
          : 'border-transparent bg-white text-gray-600 shadow-sm ring-1 ring-gray-950/5 hover:border-gray-200 hover:text-gray-900'
      } `}
    >
      {word}
    </button>
  );
}
