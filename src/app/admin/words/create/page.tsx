'use client';

import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function WordCreatePage() {
  const [examples, setExamples] = useState([{ id: 1 }]);

  const addExample = () => {
    setExamples((prev) => [...prev, { id: Date.now() }]);
  };

  const removeExample = (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setExamples((prev) => prev.filter((ex) => ex.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Link
          href="/admin"
          className="mt-1 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            단어 수정
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            한국어 표현 컨텐츠 관리
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-6">
          {/* Row 1: 단어 */}
          <div className="space-y-2">
            <label
              htmlFor="word"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              단어
            </label>
            <input
              type="text"
              id="word"
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="단어를 입력하세요"
            />
          </div>

          {/* Row 2: 발음 & 해시태그 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="pronunciation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                발음
              </label>
              <input
                type="text"
                id="pronunciation"
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="발음을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="hashtag"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                해시태그
              </label>
              <input
                type="text"
                id="hashtag"
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="#해시태그"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-2">
          <label
            htmlFor="usage"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            사용 예시 설명
          </label>
          <textarea
            id="usage"
            rows={3}
            className="block w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="사용 예시를 설명해주세요"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            예시
          </h2>
          <button
            type="button"
            onClick={addExample}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            예시 추가
          </button>
        </div>

        <div className="space-y-6">
          {examples.map((example, index) => (
            <div
              key={example.id}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  예시 {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeExample(example.id)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                    한국어 예시
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="한국어 예시를 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                    영어 번역
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="영어 번역을 입력하세요"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            이미지
          </h2>
          <button
            type="button"
            className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#6D28D9]"
          >
            이미지 생성
          </button>
        </div>

        {/* Image Display Area - Placeholder */}
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              이미지 생성 버튼을 눌러 이미지를 만들어주세요.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="publish"
          type="checkbox"
          className="h-6 w-6 rounded border-gray-300 text-purple-600 focus:ring-purple-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-900"
        />
        <label
          htmlFor="publish"
          className="text-xl font-medium text-gray-700 dark:text-gray-300"
        >
          발행 여부
        </label>
      </div>

      <div className="flex items-center justify-between pt-4">
        {/* Left: DatePicker */}
        <div>
          <input
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            취소
          </Link>
          <button
            type="button"
            className="rounded-lg bg-[#7C3AED] px-8 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#6D28D9]"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
