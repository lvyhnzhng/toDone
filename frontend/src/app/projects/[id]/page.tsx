'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft, Kanban, Users, Calendar } from 'lucide-react';
import { useProjectStore, useBoardStore, useUIStore } from '@/store';
import { apiClient } from '@/lib/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { CreateBoardDialog } from '@/components/dialogs/CreateBoardDialog';
import Link from 'next/link';
import { ClientOnly } from '@/components/ClientOnly';

export default function ProjectPage() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <ProjectPageContent />
    </ClientOnly>
  );
}

function ProjectPageContent() {
  const params = useParams();
  const projectId = params.id as string;
  
  const { currentProject, setCurrentProject } = useProjectStore();
  const { boards, setBoards } = useBoardStore();
  const { createBoardDialogOpen, setCreateBoardDialogOpen } = useUIStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadBoards();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await apiClient.getProject(projectId);
      
      if (response.success && response.data) {
        setCurrentProject(response.data);
      } else {
        setError(response.message || 'Failed to load project');
      }
    } catch (err) {
      setError('Failed to load project');
      console.error('Error loading project:', err);
    }
  };

  const loadBoards = async () => {
    try {
      const response = await apiClient.getBoards();
      
      if (response.success && response.data) {
        // Filter boards for current project
        const projectBoards = response.data.filter(board => board.project_id === projectId);
        setBoards(projectBoards);
      }
    } catch (err) {
      console.error('Error loading boards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading project...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <div className="mb-2">{error}</div>
            <Button onClick={loadProject} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!currentProject) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Project not found</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentProject.name}</h1>
              {currentProject.description && (
                <p className="text-gray-600 mt-1">{currentProject.description}</p>
              )}
              <div className="flex items-center mt-4 space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {currentProject.members?.length || 0} members
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created {formatDate(currentProject.created_at)}
                </div>
              </div>
            </div>
            
            <Button onClick={() => setCreateBoardDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Board
            </Button>
          </div>
        </div>

        {/* Boards Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Kanban Boards</h2>
          
          {boards.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Kanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No boards yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first kanban board to start organizing tasks
                </p>
                <Button onClick={() => setCreateBoardDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Board
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <Link key={board.id} href={`/boards/${board.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Kanban className="w-5 h-5 mr-2 text-green-600" />
                        {board.name}
                      </CardTitle>
                      <CardDescription>{board.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          Created {formatDate(board.created_at)}
                        </div>
                        <Button variant="outline" className="w-full">
                          Open Board
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Create Board Dialog */}
        <CreateBoardDialog
          open={createBoardDialogOpen}
          onOpenChange={setCreateBoardDialogOpen}
        />
      </div>
    </MainLayout>
  );
} 