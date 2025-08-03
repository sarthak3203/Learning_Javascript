import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addNote, updateNote, deleteNote, setSelectedSubject } from "@/store/slices/notesSlice";
import { generateFlashcard } from "@/store/slices/flashcardsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, CreditCard, BookOpen } from "lucide-react";
import type { Note } from "@/store/slices/notesSlice";

const Notes = () => {
  const { notes, selectedSubject } = useSelector((state: RootState) => state.notes);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const subjects = Array.from(new Set(notes.map(note => note.subject)));
  const filteredNotes = selectedSubject === 'all' 
    ? notes 
    : notes.filter(note => note.subject === selectedSubject);

  const handleSubmit = () => {
    if (!title.trim() || !subject.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (editingNote) {
      dispatch(updateNote({
        ...editingNote,
        title,
        subject,
        content,
      }));
      toast({
        title: "Success",
        description: "Note updated successfully!",
      });
    } else {
      dispatch(addNote({ title, subject, content }));
      toast({
        title: "Success",
        description: "Note created successfully!",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setContent("");
    setEditingNote(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setSubject(note.subject);
    setContent(note.content);
    setIsDialogOpen(true);
  };

  const handleDelete = (noteId: string) => {
    dispatch(deleteNote(noteId));
    toast({
      title: "Deleted",
      description: "Note deleted successfully",
    });
  };

  const handleGenerateFlashcard = (note: Note) => {
    const front = note.title;
    const back = note.content.substring(0, 200) + (note.content.length > 200 ? "..." : "");
    
    dispatch(generateFlashcard({
      noteId: note.id,
      front,
      back,
    }));

    toast({
      title: "Flashcard Generated!",
      description: "A flashcard has been created from this note",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Notes</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-focus">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? "Edit Note" : "Create New Note"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Mathematics, History..."
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note content here..."
                  rows={6}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingNote ? "Update" : "Create"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={selectedSubject} onValueChange={(value) => dispatch(setSelectedSubject(value))}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground">
          {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="shadow-card hover:shadow-focus transition-shadow duration-300 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="truncate">{note.title}</span>
                <span className="text-xs bg-primary-light text-primary-dark px-2 py-1 rounded-full">
                  {note.subject}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {note.content}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerateFlashcard(note)}
                  >
                    <CreditCard className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(note)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No notes found</h3>
          <p className="text-muted-foreground mb-6">
            {selectedSubject === 'all' 
              ? "Create your first note to get started!" 
              : `No notes found for "${selectedSubject}"`
            }
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Note
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notes;