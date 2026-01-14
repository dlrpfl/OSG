'use client';

import { ArrowLeft, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWordStore } from '@/store/wordStore';
import { createClient } from '@/utils/supabase/client';
import api from '@/lib/axios';
import { isAxiosError } from 'axios';

export default function WordCreatePage() {
  const router = useRouter();
  const { selectedWord } = useWordStore();
  const supabase = createClient();

  const [examples, setExamples] = useState([
    selectedWord
      ? {
          id: Date.now(),
          kr: selectedWord.example_kr,
          en: selectedWord.example_en,
        }
      : { id: 1, kr: '', en: '' },
  ]);
  const [word, setWord] = useState(selectedWord?.word || '');
  const [pronunciation, setPronunciation] = useState(
    selectedWord?.pronunciation || ''
  );
  const [hashtags, setHashtags] = useState(
    selectedWord?.hashtags.join(' ') || ''
  );
  const [meaning, setMeaning] = useState(selectedWord?.meaning || '');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const addExample = () => {
    setExamples((prev) => [...prev, { id: Date.now(), kr: '', en: '' }]);
  };

  const removeExample = (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setExamples((prev) => prev.filter((ex) => ex.id !== id));
    }
  };

  const handleGenerateImage = async () => {
    if (!meaning) {
      alert('이미지를 생성하려면 "의미"를 먼저 입력해주세요.');
      return;
    }

    try {
      setIsGeneratingImage(true);
      const response = await api<{ result: string, isImage?: boolean }>('/create-words', {
        type: 'image',
        prompt: meaning,
      });
      
      // Assuming result is base64 or url. 
      // Ideally, prefixes like 'data:image/png;base64,' should be handled if not present.
      let result = response.data.result;
      
      // Simple check to add prefix if it looks like raw base64
      if (!result.startsWith('http') && !result.startsWith('data:image')) {
          result = `data:image/png;base64,${result}`;
      }

      // Convert Base64 to Blob
      const res = await fetch(result);
      const blob = await res.blob();
      
      // Generate filename
      const filename = `gen_${Date.now()}.png`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filename, blob, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filename);
      
      setImageUrl(publicUrl);
    } catch (error) {
      console.error('Image generation/upload error:', error);
      alert('이미지 생성 또는 업로드에 실패했습니다.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSave = async () => {
    if (!word || !meaning) {
      alert('단어와 의미는 필수 입력 항목입니다.');
      return;
    }

    try {
      setIsSaving(true);

      // Parse hashtags
      const hashtagArray = hashtags
        .split(' ')
        .filter((tag) => tag.trim() !== '')
        .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));

      // Basic schema supports one example pair. We take the first one.
      const exampleKr = examples.length > 0 ? examples[0].kr : '';
      const exampleEn = examples.length > 0 ? examples[0].en : '';

      const { error } = await supabase.from('words').insert([
        {
          word,
          pronunciation,
          meaning,
          example_kr: exampleKr,
          example_en: exampleEn,
          hashtags: hashtagArray,
          image_url: imageUrl,
          is_published: isPublished,
        },
      ]);

      if (error) throw error;

      alert('저장되었습니다.');
      router.push('/admin');
    } catch (error) {
      console.error('Error saving word:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
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
              value={word}
              onChange={(e) => setWord(e.target.value)}
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
                value={pronunciation}
                onChange={(e) => setPronunciation(e.target.value)}
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
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="#해시태그 (공백으로 구분)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meaning Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-2">
          <label
            htmlFor="meaning"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            의미
          </label>
          <textarea
            id="meaning"
            rows={3}
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            className="block w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="단어의 의미를 입력해주세요"
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
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeExample(example.id)}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                    한국어 예시
                  </label>
                  <input
                    type="text"
                    value={example.kr}
                    onChange={(e) => {
                      const newExamples = [...examples];
                      newExamples[index].kr = e.target.value;
                      setExamples(newExamples);
                    }}
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
                    value={example.en}
                    onChange={(e) => {
                      const newExamples = [...examples];
                      newExamples[index].en = e.target.value;
                      setExamples(newExamples);
                    }}
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
            onClick={handleGenerateImage}
            disabled={isGeneratingImage}
            className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#6D28D9] disabled:opacity-50"
          >
            {isGeneratingImage && <Loader2 className="h-4 w-4 animate-spin" />}
            이미지 생성
          </button>
        </div>

        {/* Image Display Area */}
        <div className="relative mx-auto flex aspect-[4/3] w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Generated" 
              className="h-full w-full object-cover" 
            />
          ) : (
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
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="publish"
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
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
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-8 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#6D28D9] disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
