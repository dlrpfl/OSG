'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useWordStore, RecommendedWord } from '@/store/wordStore';
import WordOption from './WordOption';

interface CreateWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: RecommendedWord[];
}

export default function CreateWordModal({
  isOpen,
  onClose,
  words,
}: CreateWordModalProps) {
  const router = useRouter();
  const [selectedWord, setSelectedWord] = useState<RecommendedWord | null>(
    null
  );

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
            {words.map((item) => (
              <WordOption
                key={item.word}
                word={item.word}
                isSelected={selectedWord?.word === item.word}
                onSelect={() =>
                  setSelectedWord(
                    selectedWord?.word === item.word ? null : item
                  )
                }
              />
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
                  // Use Zustand store instead of URL params
                  useWordStore.getState().setSelectedWord(selectedWord);
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
