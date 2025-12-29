'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CreateWordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECOMMENDED_WORDS = [
  '쓸친소',
  '갓생',
  '현타',
  '존버',
  '꿀잼',
  '인싸',
  '아싸',
  '갑분싸',
  '핵인싸',
  '혼코노',
];

export default function CreateWordModal({
  isOpen,
  onClose,
}: CreateWordModalProps) {
  const router = useRouter();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl duration-200">
        {/* Header / Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8 sm:p-10">
          <h2 className="mb-8 text-xl font-bold text-gray-900">
            추천 단어들 중 하나를 선택하세요.
          </h2>

          {/* Word Grid */}
          <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {RECOMMENDED_WORDS.map((word) => (
              <button
                key={word}
                onClick={() =>
                  setSelectedWord(word === selectedWord ? null : word)
                }
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  selectedWord === word
                    ? 'border-[#7C3AED] bg-white text-[#7C3AED] shadow-sm ring-1 ring-[#7C3AED]/20'
                    : 'border-transparent bg-white text-gray-600 shadow-sm ring-1 ring-gray-950/5 hover:border-gray-200 hover:text-gray-900'
                } `}
              >
                {word}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button className="rounded-full bg-black px-8 py-3 text-xs font-bold tracking-wider text-white transition-colors hover:bg-gray-800">
              RETRY
            </button>
            <button
              disabled={!selectedWord}
              onClick={() => {
                if (selectedWord) {
                  // In a real app, you might want to pass the selected word via query params or context
                  // router.push(`/admin/words/create?word=${encodeURIComponent(selectedWord)}`)
                  router.push('/admin/words/create');
                }
              }}
              className={`rounded-full px-8 py-3 text-xs font-bold tracking-wider transition-colors ${
                selectedWord
                  ? 'bg-[#7C3AED] text-white hover:bg-[#6D28D9]'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              } `}
            >
              GENERATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
