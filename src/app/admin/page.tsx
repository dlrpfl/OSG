import WordTable from '@/components/admin/WordTable';

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          단어 관리
        </h2>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          매일 추가되는 한국어 표현들을 관리합니다.
        </p>
      </div>

      <WordTable />
    </div>
  );
}
