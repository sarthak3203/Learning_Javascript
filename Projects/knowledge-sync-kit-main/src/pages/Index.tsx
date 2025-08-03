import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  Timer, 
  BarChart3,
  ArrowRight,
  Brain,
  Target,
  Zap
} from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="flex items-center justify-center mb-6">
          <GraduationCap className="h-16 w-16 text-primary mr-4" />
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            StudySync
          </h1>
        </div>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your ultimate study companion. Organize notes, create flashcards, track focus sessions, 
          and monitor your learning progress - all in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="shadow-focus">
            <Link to="/notes">
              <BookOpen className="h-5 w-5 mr-2" />
              Start Taking Notes
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/timer">
              <Timer className="h-5 w-5 mr-2" />
              Begin Focus Session
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-focus transition-all duration-300 animate-slide-up">
          <CardHeader>
            <BookOpen className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Smart Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Organize your study material by subject. Create, edit, and manage all your notes in one place.
            </p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/notes" className="group">
                Explore Notes
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-focus transition-all duration-300 animate-slide-up">
          <CardHeader>
            <CreditCard className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Flashcards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Transform your notes into interactive flashcards. Test your knowledge with flip animations.
            </p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/flashcards" className="group">
                View Flashcards
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-focus transition-all duration-300 animate-slide-up">
          <CardHeader>
            <Timer className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Focus Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Boost productivity with Pomodoro-style sessions. 25 minutes focus, 5 minutes break.
            </p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/timer" className="group">
                Start Timer
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-focus transition-all duration-300 animate-slide-up">
          <CardHeader>
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Progress Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Monitor your study progress, track mastery rates, and achieve your learning goals.
            </p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard" className="group">
                View Dashboard
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gradient-secondary rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Choose StudySync?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Designed by students, for students. Every feature is crafted to enhance your learning experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="text-center">
            <Brain className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Enhanced Learning</h3>
            <p className="text-muted-foreground">
              Active recall through flashcards and spaced repetition improves memory retention.
            </p>
          </div>
          
          <div className="text-center">
            <Target className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Stay Focused</h3>
            <p className="text-muted-foreground">
              Pomodoro timer keeps you productive and prevents burnout with regular breaks.
            </p>
          </div>
          
          <div className="text-center">
            <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              Visual progress tracking motivates you to achieve your academic goals.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Study Habits?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of students who have improved their learning with StudySync.
        </p>
        <Button size="lg" asChild className="shadow-focus">
          <Link to="/notes">
            <GraduationCap className="h-5 w-5 mr-2" />
            Get Started Now
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;
