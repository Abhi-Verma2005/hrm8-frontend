import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface CandidateCard {
  id: string;
  name: string;
  position: string;
  email: string;
  avatar?: string;
  score: number;
  tags: string[];
  appliedDate: string;
}

export interface Column {
  id: string;
  title: string;
  cards: CandidateCard[];
  color: string;
}

const initialColumns: Column[] = [
  {
    id: "applied",
    title: "Applied",
    color: "bg-muted",
    cards: [
      {
        id: "c1",
        name: "Sarah Johnson",
        position: "Senior Frontend Developer",
        email: "sarah.j@email.com",
        score: 92,
        tags: ["React", "TypeScript"],
        appliedDate: "2025-01-08",
      },
      {
        id: "c2",
        name: "Michael Chen",
        position: "Senior Frontend Developer",
        email: "m.chen@email.com",
        score: 88,
        tags: ["Vue.js", "Node.js"],
        appliedDate: "2025-01-07",
      },
    ],
  },
  {
    id: "screening",
    title: "Screening",
    color: "bg-primary-light",
    cards: [
      {
        id: "c3",
        name: "Emma Davis",
        position: "Senior Frontend Developer",
        email: "emma.d@email.com",
        score: 95,
        tags: ["React", "Next.js"],
        appliedDate: "2025-01-06",
      },
    ],
  },
  {
    id: "interview",
    title: "Interview",
    color: "bg-warning-light",
    cards: [
      {
        id: "c4",
        name: "James Wilson",
        position: "Senior Frontend Developer",
        email: "j.wilson@email.com",
        score: 90,
        tags: ["Angular", "RxJS"],
        appliedDate: "2025-01-05",
      },
      {
        id: "c5",
        name: "Lisa Anderson",
        position: "Senior Frontend Developer",
        email: "lisa.a@email.com",
        score: 93,
        tags: ["React", "GraphQL"],
        appliedDate: "2025-01-04",
      },
    ],
  },
  {
    id: "offer",
    title: "Offer",
    color: "bg-success-light",
    cards: [
      {
        id: "c6",
        name: "David Martinez",
        position: "Senior Frontend Developer",
        email: "d.martinez@email.com",
        score: 96,
        tags: ["React", "AWS"],
        appliedDate: "2025-01-03",
      },
    ],
  },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeCard, setActiveCard] = useState<CandidateCard | null>(null);
  const [scoreRange, setScoreRange] = useState<number[]>([0, 100]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeColumn = columns.find((col) =>
      col.cards.some((card) => card.id === active.id)
    );
    const card = activeColumn?.cards.find((card) => card.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeColumnId = columns.find((col) =>
      col.cards.some((card) => card.id === active.id)
    )?.id;

    const overColumnId = columns.find((col) =>
      col.cards.some((card) => card.id === over.id) || col.id === over.id
    )?.id;

    if (!activeColumnId || !overColumnId) return;

    if (activeColumnId === overColumnId) {
      // Reordering within the same column
      setColumns((cols) =>
        cols.map((col) => {
          if (col.id === activeColumnId) {
            const oldIndex = col.cards.findIndex((card) => card.id === active.id);
            const newIndex = col.cards.findIndex((card) => card.id === over.id);
            return {
              ...col,
              cards: arrayMove(col.cards, oldIndex, newIndex),
            };
          }
          return col;
        })
      );
    } else {
      // Moving to a different column
      setColumns((cols) => {
        const activeCol = cols.find((col) => col.id === activeColumnId);
        const overCol = cols.find((col) => col.id === overColumnId);
        
        if (!activeCol || !overCol) return cols;

        const activeCard = activeCol.cards.find((card) => card.id === active.id);
        if (!activeCard) return cols;

        return cols.map((col) => {
          if (col.id === activeColumnId) {
            return {
              ...col,
              cards: col.cards.filter((card) => card.id !== active.id),
            };
          }
          if (col.id === overColumnId) {
            return {
              ...col,
              cards: [...col.cards, activeCard],
            };
          }
          return col;
        });
      });
    }
  };

  const totalCandidates = columns.reduce((acc, col) => acc + col.cards.length, 0);
  
  const availableTags = ["React", "TypeScript", "Vue.js", "Node.js", "Next.js", "Angular", "RxJS", "GraphQL", "AWS"];
  const activeFiltersCount = (scoreRange[0] !== 0 || scoreRange[1] !== 100 ? 1 : 0) + selectedTags.length;

  return (
    <div className="min-h-screen bg-gradient-soft p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="mb-2">Candidate Pipeline</h2>
              <p className="text-muted-foreground">
                Senior Frontend Developer • {totalCandidates} candidates
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter />
                    Filter
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 bg-primary text-primary-foreground">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3 text-sm">Score Range</h4>
                      <Slider
                        value={scoreRange}
                        onValueChange={setScoreRange}
                        max={100}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{scoreRange[0]}</span>
                        <span>{scoreRange[1]}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 text-sm">Skills</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {availableTags.map((tag) => (
                          <div key={tag} className="flex items-center">
                            <Checkbox
                              id={tag}
                              checked={selectedTags.includes(tag)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTags([...selectedTags, tag]);
                                } else {
                                  setSelectedTags(selectedTags.filter((t) => t !== tag));
                                }
                              }}
                            />
                            <Label htmlFor={tag} className="ml-2 text-sm cursor-pointer">
                              {tag}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setScoreRange([0, 100]);
                          setSelectedTags([]);
                        }}
                      >
                        Clear
                      </Button>
                      <Button size="sm" className="flex-1">
                        Apply
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="gradient" size="sm">
                <Plus />
                Add Candidate
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-primary-light text-primary border-0">Active</Badge>
            <Badge variant="outline">Remote</Badge>
            <Badge variant="outline">Full-time</Badge>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </div>

          <DragOverlay>
            {activeCard ? (
              <Card className="p-4 shadow-xl opacity-90">
                <KanbanCard card={activeCard} />
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}