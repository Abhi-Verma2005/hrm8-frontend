import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Lock } from "lucide-react";
import { getEmployerNotes, deleteNote } from "@/lib/employerCRMStorage";
import { EmployerNote } from "@/types/employerCRM";
import { formatDistanceToNow } from "date-fns";
import { AddNoteDialog } from "./AddNoteDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface NotesSectionProps {
  employerId: string;
}

export function NotesSection({ employerId }: NotesSectionProps) {
  const [notes, setNotes] = useState<EmployerNote[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<EmployerNote | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<EmployerNote | null>(null);

  useEffect(() => {
    setNotes(getEmployerNotes(employerId));
  }, [employerId]);

  const handleDeleteNote = () => {
    if (!noteToDelete) return;
    
    const success = deleteNote(noteToDelete.id);
    if (success) {
      setNotes(notes.filter(n => n.id !== noteToDelete.id));
      toast({ title: "Note deleted successfully" });
    } else {
      toast({ title: "Failed to delete note", variant: "destructive" });
    }
    
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleNoteAdded = (note: EmployerNote) => {
    if (editingNote) {
      setNotes(notes.map(n => n.id === note.id ? note : n));
    } else {
      setNotes([note, ...notes]);
    }
    setEditingNote(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notes & Communications</CardTitle>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notes yet
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map(note => (
                <div key={note.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{note.category}</Badge>
                      {note.isPrivate && (
                        <Badge variant="secondary">
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setEditingNote(note);
                          setAddDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setNoteToDelete(note);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm">{note.content}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{note.authorName}</span>
                    <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddNoteDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) setEditingNote(null);
        }}
        employerId={employerId}
        onNoteAdded={handleNoteAdded}
        editingNote={editingNote}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
