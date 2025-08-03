import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { toggleFlashcardKnown, deleteFlashcard } from "@/store/slices/flashcardsSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, RotateCcw, Check, X, Trash2 } from "lucide-react";

const Flashcards = () => {
  const { flashcards } = useSelector((state: RootState) => state.flashcards);
  const { notes } = useSelector((state: RootState) => state.notes);
  const dispatch = useDispatch();
  
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const knownCount = flashcards.filter(fc => fc.isKnown).length;
  const unknownCount = flashcards.length - knownCount;
  const progressPercentage = flashcards.length > 0 ? (knownCount / flashcards.length) * 100 : 0;

  const toggleFlip = (cardId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(cardId)) {
      newFlipped.delete(cardId);
    } else {
      newFlipped.add(cardId);
    }
    setFlippedCards(newFlipped);
  };

  const handleToggleKnown = (cardId: string) => {
    dispatch(toggleFlashcardKnown(cardId));
  };

  const handleDelete = (cardId: string) => {
    dispatch(deleteFlashcard(cardId));
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
  };

  const getNoteTitle = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    return note?.title || "Unknown Note";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Flashcards</h1>
        </div>
      </div>

      {flashcards.length > 0 && (
        <div className="bg-card rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Progress Overview</h2>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span>Known: {knownCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span>Learning: {unknownCount}</span>
              </div>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {Math.round(progressPercentage)}% mastered
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcards.map((flashcard) => {
          const isFlipped = flippedCards.has(flashcard.id);
          
          return (
            <div
              key={flashcard.id}
              className="relative h-64 perspective-1000 animate-slide-up"
            >
              <Card 
                className={`
                  absolute inset-0 w-full h-full cursor-pointer transform-style-preserve-3d transition-transform duration-600 shadow-card hover:shadow-focus
                  ${isFlipped ? 'rotate-y-180' : ''}
                `}
                onClick={() => toggleFlip(flashcard.id)}
              >
                {/* Front Side */}
                <div className={`
                  absolute inset-0 backface-hidden 
                  ${isFlipped ? 'rotate-y-180' : ''}
                `}>
                  <CardContent className="p-6 h-full flex flex-col justify-between bg-gradient-focus">
                    <div>
                      <Badge variant="secondary" className="mb-4">
                        {getNoteTitle(flashcard.noteId)}
                      </Badge>
                      <h3 className="text-lg font-semibold mb-4">Question</h3>
                      <p className="text-foreground">{flashcard.front}</p>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Click to reveal answer
                    </p>
                  </CardContent>
                </div>

                {/* Back Side */}
                <div className={`
                  absolute inset-0 backface-hidden rotate-y-180
                  ${isFlipped ? '' : 'rotate-y-180'}
                `}>
                  <CardContent className="p-6 h-full flex flex-col justify-between bg-gradient-primary">
                    <div>
                      <Badge variant="secondary" className="mb-4 text-white bg-white/20">
                        {getNoteTitle(flashcard.noteId)}
                      </Badge>
                      <h3 className="text-lg font-semibold mb-4 text-white">Answer</h3>
                      <p className="text-white/90">{flashcard.back}</p>
                    </div>
                    <p className="text-xs text-white/70 text-center">
                      Click to flip back
                    </p>
                  </CardContent>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                <Button
                  size="sm"
                  variant={flashcard.isKnown ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleKnown(flashcard.id);
                  }}
                  className={flashcard.isKnown ? "bg-success hover:bg-success/90" : ""}
                >
                  {flashcard.isKnown ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(flashcard.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {flashcards.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No flashcards yet</h3>
          <p className="text-muted-foreground mb-6">
            Create notes first, then generate flashcards from them!
          </p>
          <Button asChild>
            <a href="/notes">
              <RotateCcw className="h-4 w-4 mr-2" />
              Go to Notes
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Flashcards;