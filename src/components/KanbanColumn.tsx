import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Column } from "./KanbanBoard";

interface KanbanColumnProps {
  column: Column;
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">{column.title}</h4>
        <Badge variant="outline">{column.cards.length}</Badge>
      </div>
      
      <SortableContext
        id={column.id}
        items={column.cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`flex-1 space-y-3 p-4 rounded-lg ${column.color} min-h-[400px]`}
        >
          {column.cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}