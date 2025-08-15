'use client';

import { useAuthStore } from '@/store';
import { ClientOnly } from '@/components/ClientOnly';

function TestPageContent() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-xl text-gray-600 mb-8">
          This page tests SSR hydration issues
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Store State:</h2>
          <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>User:</strong> {user ? user.username : 'None'}</p>
          <p><strong>Client Side:</strong> {typeof window !== 'undefined' ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <TestPageContent />
    </ClientOnly>
  );
} 