'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ONE_DAY = 24 * 60 * 60 * 1000;

export async function login(prevState: any, formData: FormData) {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: ONE_DAY,
      path: '/',
    });
    redirect('/admin');
  } else {
    // In a real app we might return an error state, 
    // but for simplicity we can just redirect back or let the client handle it.
    // However, redirecting inside a server action (after logic) is common.
    // If we want to show error, we should return { error: 'Incorrect password' }
    return { error: '비밀번호가 올바르지 않습니다.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}
