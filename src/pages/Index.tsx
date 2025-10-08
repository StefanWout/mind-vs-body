import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, TrendingUp, Calendar } from 'lucide-react';
import heroImage from '@/assets/wellness-hero.jpg';

const Index = () => {
  const navigate = useNavigate();
  const entries = storage.getEntries();
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = storage.getEntryByDate(today);

  const recentEntries = entries.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-soft pb-24">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Wellness" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-60" />
        </div>
        <div className="relative max-w-md mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-3">
            Wellness Tracker
          </h1>
          <p className="text-primary-foreground/90 text-lg">
            Track your health journey with care
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 -mt-6 space-y-6">
        <Card className="p-6 shadow-soft border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Today</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>

          {todayEntry ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Entries Logged</span>
                <span className="font-medium text-foreground">✓ Complete</span>
              </div>
              <Button
                onClick={() => navigate('/log')}
                variant="outline"
                className="w-full h-12 rounded-2xl border-border hover:bg-muted transition-smooth"
              >
                Edit Today's Entry
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => navigate('/log')}
              className="w-full h-14 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:scale-105 transition-smooth"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Log Today's Entry
            </Button>
          )}
        </Card>

        <Card className="p-6 shadow-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <Button
              onClick={() => navigate('/trends')}
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary-light/20"
            >
              View All
            </Button>
          </div>

          {recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-smooth cursor-pointer"
                  onClick={() => navigate('/log')}
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {[entry.moodMorning, entry.moodMidday, entry.moodEvening]
                        .filter(m => m !== null)
                        .length} mood entries
                    </p>
                  </div>
                  <div className="text-2xl">
                    {entry.nausea ? '🤢' : entry.periodStatus !== 'none' && entry.periodStatus ? '🩸' : '✨'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No entries yet</p>
              <Button
                onClick={() => navigate('/log')}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                Start Tracking
              </Button>
            </div>
          )}
        </Card>

        <Button
          onClick={() => navigate('/trends')}
          variant="outline"
          className="w-full h-14 rounded-2xl border-border hover:bg-muted transition-smooth"
        >
          <TrendingUp className="mr-2 h-5 w-5" />
          View Trends & Insights
        </Button>
      </main>
    </div>
  );
};

export default Index;
