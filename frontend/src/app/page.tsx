'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { AuthPage } from '@/components/auth/AuthPage';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectDashboard } from '@/components/dashboard/ProjectDashboard';
import { ClientOnly } from '@/components/ClientOnly';

export default function HomePage() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <HomePageContent />
    </ClientOnly>
  );
}

function HomePageContent() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <MainLayout>
      <div className="p-6">
        <ProjectDashboard />
      </div>
    </MainLayout>
  );
}
