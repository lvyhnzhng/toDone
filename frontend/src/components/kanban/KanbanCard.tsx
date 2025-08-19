'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, User, Calendar, Tag } from 'lucide-react';
import { Card as CardType } from '@/types';

interface KanbanCardProps {
  card: CardType;
}

export function KanbanCard({ card }: KanbanCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
              {card.title}
            </h4>
            {isHovered && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {card.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {card.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              {card.created_by && (
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  <span>Creator</span>
                </div>
              )}
              {card.created_at && (
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{new Date(card.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            {card.labels && card.labels.length > 0 && (
              <div className="flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                <span>{card.labels.length}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 