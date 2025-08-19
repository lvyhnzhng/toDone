'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">toDone</h1>
          <p className="text-gray-600">Your collaborative task management platform</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex mb-6">
            <Button
              variant={isLogin ? 'default' : 'ghost'}
              onClick={() => setIsLogin(true)}
              className="flex-1"
            >
              Sign In
            </Button>
            <Button
              variant={!isLogin ? 'default' : 'ghost'}
              onClick={() => setIsLogin(false)}
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
} 