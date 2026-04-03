'use client';

import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(135deg,#0B2D96,#1B4FD8,#F97316)' }}>
        <div className="text-white text-sm font-bold opacity-60">Memuat...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
