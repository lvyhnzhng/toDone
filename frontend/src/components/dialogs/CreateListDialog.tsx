'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBoardStore } from '@/store';
import { apiClient } from '@/lib/api';

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
}

export function CreateListDialog({ open, onOpenChange, boardId }: CreateListDialogProps) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { currentBoard, setCurrentBoard } = useBoardStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.createList({ 
        board_id: boardId, 
        name, 
        position: parseInt(position) 
      });
      
      if (response.success && response.data) {
        // Update current board with new list
        if (currentBoard) {
          const updatedLists = currentBoard.lists ? [...currentBoard.lists, response.data] : [response.data];
          setCurrentBoard({ ...currentBoard, lists: updatedLists });
        }
        
        onOpenChange(false);
        // Reset form
        setName('');
        setPosition('1');
      } else {
        setError(response.message || 'Failed to create list');
      }
    } catch (err) {
      setError('An error occurred while creating the list');
      console.error('Create list error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setName('');
      setPosition('1');
      setError('');
    }
    onOpenChange(newOpen);
  };

  // Calculate available positions
  const listCount = currentBoard?.lists?.length || 0;
  const positions = Array.from({ length: listCount + 1 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
          <DialogDescription>
            Create a new list to organize your tasks in this board.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="list-name">List Name</Label>
            <Input
              id="list-name"
              placeholder="Enter list name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="list-position">Position</Label>
            <Select value={position} onValueChange={setPosition} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={pos.toString()}>
                    Position {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create List'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 