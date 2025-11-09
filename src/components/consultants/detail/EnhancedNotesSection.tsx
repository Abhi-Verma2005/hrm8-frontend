import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pin, Edit, Trash2, Search, Lock } from 'lucide-react';
import { getConsultantNotes, deleteConsultantNote, updateConsultantNote } from '@/lib/consultantCRMStorage';
import { format } from 'date-fns';
import { NoteDialog } from './NoteDialog';
import { useToast } from '@/hooks/use-toast';
import type { ConsultantNote } from '@/types/consultantCRM';

interface EnhancedNotesSectionProps {
  consultantId: string;
}

const categoryColors = {
  general: 'bg-blue-100 text-blue-700',
  performance: 'bg-green-100 text-green-700',
  issue: 'bg-red-100 text-red-700',
  achievement: 'bg-purple-100 text-purple-700',
};

const categoryLabels = {
  general: 'General',
  performance: 'Performance',
  issue: 'Issue',
  achievement: 'Achievement',
};

export function EnhancedNotesSection({ consultantId }: EnhancedNotesSectionProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<ConsultantNote | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const notes = getConsultantNotes(consultantId);

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(note => note.category === categoryFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.content.toLowerCase().includes(query)
      );
    }

    // Sort: pinned first, then by date
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notes, categoryFilter, searchQuery]);

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.isPinned);

  const handleTogglePin = (note: ConsultantNote) => {
    updateConsultantNote(note.id, {
      isPinned: !note.isPinned,
    });
    toast({
      title: note.isPinned ? 'Note unpinned' : 'Note pinned',
      description: note.isPinned ? 'Note removed from top of list' : 'Note pinned to top of list',
    });
  };

  const handleEdit = (note: ConsultantNote) => {
    setEditingNote(note);
    setDialogOpen(true);
  };

  const handleDelete = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      deleteConsultantNote(noteToDelete);
      toast({
        title: 'Note deleted',
        description: 'The note has been deleted successfully.',
      });
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleCreateNew = () => {
    setEditingNote(undefined);
    setDialogOpen(true);
  };

  const renderNote = (note: ConsultantNote) => (
    <div key={note.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={categoryColors[note.category || 'general']}>
            {categoryLabels[note.category || 'general']}
          </Badge>
          {note.isPrivate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Private
            </Badge>
          )}
          {note.isPinned && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Pin className="h-3 w-3" />
              Pinned
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {format(new Date(note.createdAt), 'MMM dd, yyyy')}
        </span>
      </div>

      <p className="text-sm whitespace-pre-wrap mb-3">{note.content}</p>

      <div className="flex items-center justify-between pt-3 border-t">
        <p className="text-xs text-muted-foreground">by {note.authorName}</p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTogglePin(note)}
            className="h-8"
          >
            <Pin className={`h-4 w-4 ${note.isPinned ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(note)}
            className="h-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(note.id)}
            className="h-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notes</CardTitle>
            <Button size="sm" onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="issue">Issue</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || categoryFilter !== 'all' ? (
                <>
                  <p className="text-sm">No notes found</p>
                  <p className="text-xs mt-1">Try adjusting your filters</p>
                </>
              ) : (
                <>
                  <p className="text-sm">No notes yet</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={handleCreateNew}>
                    Create First Note
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {pinnedNotes.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Pin className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      PINNED ({pinnedNotes.length})
                    </h4>
                  </div>
                  {pinnedNotes.map(renderNote)}
                </>
              )}

              {unpinnedNotes.length > 0 && (
                <>
                  {pinnedNotes.length > 0 && (
                    <div className="flex items-center gap-2 mb-2 mt-6">
                      <h4 className="text-sm font-semibold text-muted-foreground">
                        ALL NOTES ({unpinnedNotes.length})
                      </h4>
                    </div>
                  )}
                  {unpinnedNotes.map(renderNote)}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <NoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        consultantId={consultantId}
        note={editingNote}
        onSuccess={() => {
          // Force re-render by not doing anything, component will auto-update from localStorage
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
