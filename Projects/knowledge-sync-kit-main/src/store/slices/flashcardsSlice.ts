import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Flashcard {
  id: string;
  noteId: string;
  front: string;
  back: string;
  isKnown: boolean;
  createdAt: string;
}

interface FlashcardsState {
  flashcards: Flashcard[];
}

const initialState: FlashcardsState = {
  flashcards: [],
};

const flashcardsSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    generateFlashcard: (state, action: PayloadAction<{ noteId: string; front: string; back: string }>) => {
      const existingFlashcard = state.flashcards.find(fc => fc.noteId === action.payload.noteId);
      
      if (existingFlashcard) {
        existingFlashcard.front = action.payload.front;
        existingFlashcard.back = action.payload.back;
      } else {
        const newFlashcard: Flashcard = {
          id: Date.now().toString(),
          noteId: action.payload.noteId,
          front: action.payload.front,
          back: action.payload.back,
          isKnown: false,
          createdAt: new Date().toISOString(),
        };
        state.flashcards.push(newFlashcard);
      }
    },
    toggleFlashcardKnown: (state, action: PayloadAction<string>) => {
      const flashcard = state.flashcards.find(fc => fc.id === action.payload);
      if (flashcard) {
        flashcard.isKnown = !flashcard.isKnown;
      }
    },
    deleteFlashcard: (state, action: PayloadAction<string>) => {
      state.flashcards = state.flashcards.filter(fc => fc.id !== action.payload);
    },
    deleteFlashcardsByNoteId: (state, action: PayloadAction<string>) => {
      state.flashcards = state.flashcards.filter(fc => fc.noteId !== action.payload);
    },
  },
});

export const { 
  generateFlashcard, 
  toggleFlashcardKnown, 
  deleteFlashcard, 
  deleteFlashcardsByNoteId 
} = flashcardsSlice.actions;
export default flashcardsSlice.reducer;