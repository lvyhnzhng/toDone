'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useBoardStore } from '@/store';
import { apiClient } from '@/lib/api';
import { Board, List, Card as CardType } from '@/types';
import { KanbanList } from './KanbanList';

interface KanbanBoardProps {
  boardId: string;
}

export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const { currentBoard, setCurrentBoard } = useBoardStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getBoard(boardId);
      
      if (response.success && response.data) {
        setCurrentBoard(response.data);
      } else {
        setError(response.message || 'Failed to load board');
      }
    } catch (err) {
      setError('Failed to load board');
      console.error('Error loading board:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading board...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <div className="mb-2">{error}</div>
          <Button onClick={loadBoard} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Board not found</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentBoard.name}</h1>
          {currentBoard.description && (
            <p className="text-gray-600 mt-1">{currentBoard.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4 mr-2" />
            More
          </Button>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex space-x-6 min-w-max">
          {currentBoard.lists && currentBoard.lists.length > 0 ? (
            currentBoard.lists.map((list) => (
              <KanbanList key={list.id} list={list} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No lists yet. Create your first list to get started.
            </div>
          )}
          
          {/* Add New List Button */}
          <div className="w-80 flex-shrink-0">
            <Button variant="outline" className="w-full h-32 border-dashed">
              <Plus className="w-4 h-4 mr-2" />
              Add List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 