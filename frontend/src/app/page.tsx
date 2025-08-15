'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore, useProjectStore } from '@/store';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FolderOpen, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { ClientOnly } from '@/components/ClientOnly';

function HomePageContent() {
  const { user, isAuthenticated } = useAuthStore();
  const { projects, setProjects } = useProjectStore();

  const loadProjects = useCallback(async () => {
    try {
      const response = await apiClient.getProjects();
      if (response.success && response.data) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }, [setProjects]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated, loadProjects]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to toDone</h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern, real-time collaborative kanban board for task management
          </p>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
            <p className="text-gray-600 mt-2">Manage your projects and tasks efficiently</p>
          </div>
          <Button onClick={() => {}} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                    {project.name}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {project.members.length} members
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first project to organize your tasks.
            </p>
            <Button onClick={() => {}} className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
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
      <HomePageContent />
    </ClientOnly>
  );
}
