'use client';

import { Edit2, Trash2, Search, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import CreateWordModal from './CreateWordModal';
import { supabase } from '@/lib/supabase';
import { RecommendedWord } from '@/store/wordStore';
import api from '@/lib/axios';
import { isAxiosError } from 'axios';

interface ApiResponse {
  result: string;
  usedPrompt?: string;
}

interface ParsedData {
  words: RecommendedWord[];
}


interface TableWord {
  id: number;
  created_at: string; // ISO timestamp from Supabase
  word: string;
  imageStatus: string;
  work_status: string; // Changed from workStatus to match DB
  displayStatus: string;
  image_url: string;
  is_published: boolean;
}

export default function WordTable() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<TableWord[]>([]);
  const [suggestedWords, setSuggestedWords] = useState<RecommendedWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');

  // Fetch rows for the table (no modal)
  const fetchRows = async (term = '') => {
    try {
      setIsLoading(true);
      let query = supabase.from('words').select('*', { count: 'exact' });

      if (term) {
        query = query.or(`word.ilike.%${term}%,meaning.ilike.%${term}%`);
      }

      const { data, error } = await query.order('id', { ascending: true });

      if (error) {
        console.error('Supabase fetch error:', error);
        alert('Failed to load words.');
        return;
      }

      if (data) {
        setRows(data);
      }
    } catch (e) {
      console.error('Unexpected error:', e);
      alert('Unexpected error while loading words.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load table data on mount
  useEffect(() => {
    fetchRows();
  }, []);

  const handleSearch = () => {
    fetchRows(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handler for the "새로운 단어 생성" button – generate words via API then open modal
  const handleCreateClick = async (customPrompt?: string) => {
    try {
      setIsLoading(true);
      const response = await api<ApiResponse>('/create-words', {
        prompt: customPrompt
      });
      const parsedData = JSON.parse(response.data.result) as ParsedData;

      if (parsedData.words) {
        setSuggestedWords(parsedData.words);
        if (response.data.usedPrompt) {
            setCurrentPrompt(response.data.usedPrompt);
        }
        setIsModalOpen(true);
      }
    } catch (error: unknown) {
      console.error('Error fetching words:', error);
      let errorMessage = 'Failed to fetch words. Please try again.';

      if (isAxiosError(error)) {
        const data = error.response?.data as { error?: string };
        if (data?.error) {
          errorMessage = data.error;
        }
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit button – navigate to edit page (you can replace with a modal later)
  const handleEdit = (id: number) => {
    router.push(`/admin/words/edit/${id}`);
  };

  // Delete button – remove row from Supabase and refresh list
  const handleDelete = async (id: number) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('words')
      .delete()
      .eq('id', id)
      .select(); // return deleted rows for confirmation

    if (error) {
      console.error('Supabase delete error:', error);
      alert('Failed to delete word.');
    } else {
      console.log('Deleted rows:', data);
      await fetchRows();
    }
    setIsLoading(false);
  };




  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="단어나 의미로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-4 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
          />
          <button 
            onClick={handleSearch}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={() => handleCreateClick()}
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
        words={suggestedWords}
        onRetry={handleCreateClick}
        isLoading={isLoading}
        initialPrompt={currentPrompt}
      />

      <div className="text-sm font-medium text-gray-600">
        총 <span className="text-gray-900">{rows.length}개</span>
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
            {rows.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-5 text-center text-sm font-medium text-gray-600">
                  {new Date(item.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </td>
                <td className="px-6 py-5 text-center text-sm font-bold text-gray-900">
                  {item.word}
                </td>
                <td className="px-6 py-5 text-center">
                  {item.image_url ? (
                    <a
                      href={item.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                    >
                      이미지 보기
                    </a>
                  ) : (
                    <span className="inline-flex w-24 items-center justify-center rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-500">
                      미생성
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 text-center">
                  <span
                    className={`inline-flex w-24 items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium ${
                      item.work_status === '디자인완료'
                        ? 'bg-[#DCFCE7] text-[#166534]'
                        : item.work_status === '기획완료'
                        ? 'bg-[#FEF3C7] text-[#92400E]'
                        : 'bg-gray-100 text-gray-500' // Changed '작업전' style to match initial gray style if desired, or keep specific.
                    }`}
                  >
                    {item.work_status || '작업전'}
                  </span>
                </td>
                <td className="px-6 py-5 text-center text-sm text-gray-600">
                  {item.is_published ? '발행' : '미발행'}
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="text-gray-400 transition-colors hover:text-gray-600"
                      onClick={() => handleEdit(item.id)}
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      className="text-gray-400 transition-colors hover:text-red-500"
                      onClick={() => handleDelete(item.id)}
                    >
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
