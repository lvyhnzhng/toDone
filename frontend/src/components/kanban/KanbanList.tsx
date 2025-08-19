'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import { List, Card as CardType } from '@/types';
import { KanbanCard } from './KanbanCard';

interface KanbanListProps {
  list: List;
}

export function KanbanList({ list }: KanbanListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);

  return (
    <div className="w-80 flex-shrink-0">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-900">
              {list.name}
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          {list.cards && (
            <div className="text-xs text-gray-500">
              {list.cards.length} {list.cards.length === 1 ? 'card' : 'cards'}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-2">
            {list.cards && list.cards.length > 0 ? (
              list.cards.map((card) => (
                <KanbanCard key={card.id} card={card} />
              ))
            ) : (
              <div className="text-center text-gray-400 py-4 text-sm">
                No cards yet
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed"
              onClick={() => setIsAddingCard(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 