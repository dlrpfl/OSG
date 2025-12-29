import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            서비스를 이용하시려면 로그인이 필요합니다
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                간편 로그인
              </span>
            </div>
          </div>

          <GoogleLoginButton />

          <div className="relative flex justify-center text-sm">
            <a
              href="/admin"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              관리자 페이지로 이동 (임시)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
