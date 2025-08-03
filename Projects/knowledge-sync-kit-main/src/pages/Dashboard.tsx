import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  BookOpen, 
  CreditCard, 
  Timer, 
  TrendingUp, 
  Award,
  Clock,
  Target
} from "lucide-react";

const Dashboard = () => {
  const { notes } = useSelector((state: RootState) => state.notes);
  const { flashcards } = useSelector((state: RootState) => state.flashcards);
  const { totalFocusTime, completedSessions } = useSelector((state: RootState) => state.timer);

  const knownFlashcards = flashcards.filter(fc => fc.isKnown).length;
  const unknownFlashcards = flashcards.length - knownFlashcards;
  const masteryPercentage = flashcards.length > 0 ? (knownFlashcards / flashcards.length) * 100 : 0;

  const subjects = Array.from(new Set(notes.map(note => note.subject)));
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate study goals and achievements
  const studyGoalHours = 2; // 2 hours daily goal
  const dailyGoalSeconds = studyGoalHours * 3600;
  const goalProgress = Math.min((totalFocusTime / dailyGoalSeconds) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-focus transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{notes.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-focus transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{flashcards.length}</div>
            <p className="text-xs text-muted-foreground">
              {knownFlashcards} mastered, {unknownFlashcards} learning
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-focus transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatTime(totalFocusTime)}</div>
            <p className="text-xs text-muted-foreground">
              {completedSessions} session{completedSessions !== 1 ? 's' : ''} completed
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-focus transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mastery Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{Math.round(masteryPercentage)}%</div>
            <p className="text-xs text-muted-foreground">
              Flashcard mastery
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Study Goal */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Daily Study Goal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {formatTime(totalFocusTime)} / {studyGoalHours}h
              </span>
            </div>
            <Progress value={goalProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {goalProgress >= 100 
                ? "🎉 Daily goal achieved! Great work!" 
                : `${Math.round(100 - goalProgress)}% to go!`
              }
            </p>
          </CardContent>
        </Card>

        {/* Flashcard Mastery */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Flashcard Mastery</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Known</span>
              <span className="text-sm text-muted-foreground">
                {knownFlashcards} / {flashcards.length}
              </span>
            </div>
            <Progress value={masteryPercentage} className="h-3" />
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span>Known: {knownFlashcards}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span>Learning: {unknownFlashcards}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Study Subjects</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(subject => {
                const subjectNotes = notes.filter(note => note.subject === subject);
                const subjectFlashcards = flashcards.filter(fc => {
                  const note = notes.find(n => n.id === fc.noteId);
                  return note?.subject === subject;
                });
                const knownInSubject = subjectFlashcards.filter(fc => fc.isKnown).length;
                const subjectMastery = subjectFlashcards.length > 0 
                  ? (knownInSubject / subjectFlashcards.length) * 100 
                  : 0;

                return (
                  <div key={subject} className="p-4 border rounded-lg space-y-3">
                    <h3 className="font-semibold">{subject}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>{subjectNotes.length} notes</p>
                      <p>{subjectFlashcards.length} flashcards</p>
                      {subjectFlashcards.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Mastery</span>
                            <span>{Math.round(subjectMastery)}%</span>
                          </div>
                          <Progress value={subjectMastery} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No subjects yet. Create some notes to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {(notes.length === 0 || flashcards.length === 0 || totalFocusTime === 0) && (
        <Card className="shadow-card border-accent">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Quick Start</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {notes.length === 0 && (
                <p>📝 <a href="/notes" className="text-primary hover:underline">Create your first note</a> to start studying</p>
              )}
              {notes.length > 0 && flashcards.length === 0 && (
                <p>🃏 Generate flashcards from your notes to test your knowledge</p>
              )}
              {totalFocusTime === 0 && (
                <p>⏱️ <a href="/timer" className="text-primary hover:underline">Start a focus session</a> to track your study time</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;