'use client';

import { LoginForm } from '@/components/auth-forms/login-form';
import { SignUpForm } from '@/components/auth-forms/register-form';
import { Activity, useState } from 'react';

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <h1 className="text-2xl font-bold text-center">Home Made Food</h1>

        <div className="flex gap-2 border-b">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 pb-2 ${
              mode === 'signin'
                ? 'border-b-2 border-blue-600 font-medium'
                : 'text-gray-500'
            }`}
          >
            Sign In
          </button>
          {/* <button
            onClick={() => setMode('signup')}
            className={`flex-1 pb-2 ${
              mode === 'signup'
                ? 'border-b-2 border-green-600 font-medium'
                : 'text-gray-500'
            }`}
          >
            Sign Up
          </button> */}
        </div>

        <Activity mode={mode === 'signin' ? 'visible' : 'hidden'}>
          <LoginForm />
        </Activity>
        {/* <Activity mode={mode !== 'signin' ? 'visible' : 'hidden'}>
          <SignUpForm />
        </Activity> */}
      </div>
    </div>
  );
}