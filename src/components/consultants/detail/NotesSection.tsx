import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { getConsultantNotes } from '@/lib/consultantCRMStorage';
import { format } from 'date-fns';

interface NotesSectionProps {
  consultantId: string;
}

export function NotesSection({ consultantId }: NotesSectionProps) {
  const notes = getConsultantNotes(consultantId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notes</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No notes yet
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <div key={note.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{note.category}</Badge>
                    {note.isPrivate && <Badge variant="outline">Private</Badge>}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(note.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">by {note.authorName}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
