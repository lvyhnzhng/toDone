'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface CreateCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
}

export function CreateCardDialog({ open, onOpenChange, listId }: CreateCardDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { currentBoard, setCurrentBoard } = useBoardStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.createCard({ 
        list_id: listId, 
        title, 
        description, 
        position: parseInt(position) 
      });
      
      if (response.success && response.data) {
        // Update current board with new card
        if (currentBoard && currentBoard.lists) {
          const updatedLists = currentBoard.lists.map(list => {
            if (list.id === listId) {
              const updatedCards = list.cards ? [...list.cards, response.data!] : [response.data!];
              return { ...list, cards: updatedCards };
            }
            return list;
          });
          setCurrentBoard({ ...currentBoard, lists: updatedLists });
        }
        
        onOpenChange(false);
        // Reset form
        setTitle('');
        setDescription('');
        setPosition('1');
      } else {
        setError(response.message || 'Failed to create card');
      }
    } catch (err) {
      setError('An error occurred while creating the card');
      console.error('Create card error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setTitle('');
      setDescription('');
      setPosition('1');
      setError('');
    }
    onOpenChange(newOpen);
  };

  // Find the current list to calculate available positions
  const currentList = currentBoard?.lists?.find(list => list.id === listId);
  const cardCount = currentList?.cards?.length || 0;
  const positions = Array.from({ length: cardCount + 1 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Card</DialogTitle>
          <DialogDescription>
            Create a new task card to track your work.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-title">Card Title</Label>
            <Input
              id="card-title"
              placeholder="Enter card title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-description">Description</Label>
            <Textarea
              id="card-description"
              placeholder="Enter card description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-position">Position</Label>
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
              {isLoading ? 'Creating...' : 'Create Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 