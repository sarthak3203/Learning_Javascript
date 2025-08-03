import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { startTimer, pauseTimer, resetTimer, tick, switchMode } from "@/store/slices/timerSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer as TimerIcon, Play, Pause, RotateCcw, Coffee, BookOpen } from "lucide-react";

const Timer = () => {
  const { isRunning, currentTime, isBreak, totalFocusTime, completedSessions } = useSelector(
    (state: RootState) => state.timer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        dispatch(tick());
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, dispatch]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const maxTime = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((maxTime - currentTime) / maxTime) * 100;

  const handleStartPause = () => {
    if (isRunning) {
      dispatch(pauseTimer());
    } else {
      dispatch(startTimer());
    }
  };

  const handleReset = () => {
    dispatch(resetTimer());
  };

  const handleSwitchMode = () => {
    dispatch(switchMode());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-center space-x-3">
        <TimerIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Study Timer</h1>
      </div>

      {/* Main Timer Card */}
      <Card className={`shadow-focus ${isBreak ? 'bg-gradient-break' : 'bg-gradient-focus'}`}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            {isBreak ? (
              <>
                <Coffee className="h-6 w-6" />
                <span>Break Time</span>
              </>
            ) : (
              <>
                <BookOpen className="h-6 w-6" />
                <span>Focus Time</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="relative">
            <div className="text-6xl font-mono font-bold mb-4">
              {formatTime(currentTime)}
            </div>
            <Progress 
              value={progress} 
              className={`h-3 ${isBreak ? 'bg-accent-light' : 'bg-primary-light'}`}
            />
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              onClick={handleStartPause}
              className={`${isRunning ? 'bg-warning hover:bg-warning/90' : 'bg-success hover:bg-success/90'} text-white`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            
            <Button size="lg" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
            
            <Button size="lg" variant="outline" onClick={handleSwitchMode}>
              {isBreak ? <BookOpen className="h-5 w-5 mr-2" /> : <Coffee className="h-5 w-5 mr-2" />}
              Switch to {isBreak ? 'Focus' : 'Break'}
            </Button>
          </div>

          {isRunning && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse-study"></div>
                <span className="text-sm font-medium">
                  {isBreak ? 'Taking a break...' : 'Focusing...'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Sessions Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{completedSessions}</div>
            <p className="text-sm text-muted-foreground">Pomodoro sessions</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Total Focus Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatTotalTime(totalFocusTime)}
            </div>
            <p className="text-sm text-muted-foreground">Time spent studying</p>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Focus for 25 minutes, then take a 5-minute break</p>
          <p>• Use the timer to track your study sessions</p>
          <p>• Switch between focus and break modes as needed</p>
          <p>• Your total focus time and completed sessions are automatically tracked</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timer;