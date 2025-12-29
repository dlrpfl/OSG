'use client';

import { Edit2, Trash2, Search, Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import CreateWordModal from './CreateWordModal';
import { RecommendedWord } from '@/store/wordStore';
import api from '@/lib/axios';

// Dummy data mirroring the screenshot
const words = [
  {
    id: 1,
    date: '2025. 12. 03.',
    word: '꿀잼',
    imageStatus: '생성 완료',
    workStatus: '디자인 완료',
    displayStatus: 'Y',
  },
  {
    id: 2,
    date: '2025. 12. 03.',
    word: '맛있으면 0 칼로리',
    imageStatus: '', // Empty in screenshot
    workStatus: '기획 완료',
    displayStatus: 'Y',
  },
  {
    id: 3,
    date: '2025. 12. 03.',
    word: '럭키비키',
    imageStatus: '생성 전',
    workStatus: '디자인 완료',
    displayStatus: 'Y',
  },
  {
    id: 4,
    date: '2025. 12. 03.',
    word: '꿀잼',
    imageStatus: '생성 완료',
    workStatus: '기획 완료',
    displayStatus: 'Y',
  },
  {
    id: 5,
    date: '2025. 12. 03.',
    word: '맛있으면 0 칼로리',
    imageStatus: '생성 완료',
    workStatus: '기획 완료',
    displayStatus: 'Y',
  },
];

// Define result type
interface ApiResponse {
  result: string;
}

export default function WordTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendedWords, setRecommendedWords] = useState<RecommendedWord[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const getWords = async () => {
    try {
      setIsLoading(true);
      // api<ResponseT>(url, data)
      const response = await api<ApiResponse>('/create-words', {});
      const parsedData = JSON.parse(response.data.result);

      if (parsedData.words) {
        setRecommendedWords(parsedData.words);
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching words:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="단어나 의미로 검색"
            className="w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-4 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
          />
          <button className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
            <Search className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={getWords}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              새로운 단어 생성
            </>
          )}
        </button>
      </div>

      <CreateWordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        words={recommendedWords}
      />

      <div className="text-sm font-medium text-gray-600">
        총 <span className="text-gray-900">{words.length}개</span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#7C3AED] text-sm text-white">
              <th className="w-32 px-6 py-4 text-center font-medium">생성일</th>
              <th className="px-6 py-4 text-center font-medium">단어</th>
              <th className="w-40 px-6 py-4 text-center font-medium">이미지</th>
              <th className="w-40 px-6 py-4 text-center font-medium">
                작업상태
              </th>
              <th className="w-24 px-6 py-4 text-center font-medium">
                전시상태
              </th>
              <th className="w-32 px-6 py-4 text-center font-medium">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {words.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-5 text-center text-sm font-medium text-gray-600">
                  {item.date}
                </td>
                <td className="px-6 py-5 text-center text-sm font-bold text-gray-900">
                  {item.word}
                </td>
                <td className="px-6 py-5 text-center">
                  {item.imageStatus && (
                    <span
                      className={`inline-flex w-24 items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium ${
                        item.imageStatus === '생성 완료'
                          ? 'bg-[#FEF3C7] text-[#92400E]'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.imageStatus}
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 text-center">
                  <span
                    className={`inline-flex w-24 items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium ${
                      item.workStatus === '디자인 완료'
                        ? 'bg-[#DCFCE7] text-[#166534]'
                        : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {item.workStatus}
                  </span>
                </td>
                <td className="px-6 py-5 text-center text-sm text-gray-600">
                  {item.displayStatus}
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button className="text-gray-400 transition-colors hover:text-gray-600">
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 transition-colors hover:text-red-500">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (Simple Placeholder) */}
      <div className="flex justify-center py-8">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <button className="hover:text-gray-900">&lt;</button>
          <span className="font-medium text-gray-900">1</span>
          <button className="hover:text-gray-900">&gt;</button>
        </div>
      </div>
    </div>
  );
}
