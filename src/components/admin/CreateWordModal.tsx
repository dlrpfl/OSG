'use client';

import { X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useWordStore, RecommendedWord } from '@/store/wordStore';
import WordOption from './WordOption';

interface CreateWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: RecommendedWord[];
  onRetry: (prompt?: string) => void;
  isLoading: boolean;
  initialPrompt?: string;
}

export default function CreateWordModal({
  isOpen,
  onClose,
  words,
  initialPrompt,
  onRetry,
  isLoading,
}: CreateWordModalProps) {
  const router = useRouter();
  const [selectedWord, setSelectedWord] = useState<RecommendedWord | null>(
    null
  );
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [isExpanded, setIsExpanded] = useState(false);

  // Update local prompt state when initialPrompt changes
  if (initialPrompt && prompt === '' && !isExpanded) {
      setPrompt(initialPrompt);
  }

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

          {/* Prompt Section */}
          <div className="mb-6">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-gray-500 underline"
            >
              {isExpanded ? '프롬프트 숨기기' : '프롬프트 보기/수정'}
            </button>
            {isExpanded && (
              <div className="mt-2 space-y-2">
                 <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 rounded-lg border border-gray-300 p-3 text-sm text-gray-900 focus:border-purple-600 focus:outline-none"
                  placeholder="프롬프트를 수정하세요..."
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => onRetry(prompt)}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-full bg-black px-8 py-3 text-xs font-bold tracking-wider text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              {isExpanded ? 'REGENERATE WITH PROMPT' : 'RETRY'}
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
