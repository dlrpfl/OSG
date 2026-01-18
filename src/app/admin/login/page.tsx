'use client';

import { useActionState } from 'react';
import { login } from '@/app/actions/auth';
import { Loader2 } from 'lucide-react';

const initialState = {
  error: '',
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            관리자 로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            접속하려면 비밀번호를 입력하세요.
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                placeholder="비밀번호 입력"
              />
            </div>
          </div>

          {state?.error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/30 dark:text-red-300">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 dark:ring-offset-gray-900"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              '로그인'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
