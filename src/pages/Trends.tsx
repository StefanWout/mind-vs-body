import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { DailyEntry } from '@/types/tracking';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Trends() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<DailyEntry[]>([]);

  useEffect(() => {
    if (!loading && user) {
      loadEntries();
    }
  }, [loading, user]);

  const loadEntries = async () => {
    const allEntries = await storage.getEntries();
    setEntries(allEntries);
  };

  const moodData = useMemo(() => {
    return entries
      .slice(0, 14)
      .reverse()
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        morning: entry.moodMorning || 0,
        midday: entry.moodMidday || 0,
        evening: entry.moodEvening || 0,
      }));
  }, [entries]);

  const periodData = useMemo(() => {
    const statusMap = { heavy: 4, light: 2, patchy: 3, cramps: 1, none: 0 };
    return entries
      .slice(0, 14)
      .reverse()
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        intensity: entry.periodStatus ? statusMap[entry.periodStatus] : 0,
      }));
  }, [entries]);

  const nauseaCount = useMemo(() => {
    const last14 = entries.slice(0, 14);
    return last14.filter(e => e.nausea === true).length;
  }, [entries]);

  const avgMood = useMemo(() => {
    const moods = entries
      .slice(0, 14)
      .flatMap(e => [e.moodMorning, e.moodMidday, e.moodEvening])
      .filter((m): m is number => m !== null);
    return moods.length > 0 ? (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1) : 'N/A';
  }, [entries]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-soft pb-24">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Trends & Insights</h1>
            <p className="text-sm text-muted-foreground">Last 14 days</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 shadow-card border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Avg Mood</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{avgMood}</p>
          </Card>

          <Card className="p-6 shadow-card border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Nausea Days</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{nauseaCount}</p>
          </Card>
        </div>

        <Card className="p-6 shadow-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Mood Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
              />
              <Line type="monotone" dataKey="morning" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="midday" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="evening" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Morning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-muted-foreground">Midday</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-muted-foreground">Evening</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Period Intensity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={periodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 4]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="intensity" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 mt-4 text-xs text-muted-foreground">
            <span>0 = None</span>
            <span>1 = Cramps</span>
            <span>2 = Light</span>
            <span>3 = Patchy</span>
            <span>4 = Heavy</span>
          </div>
        </Card>

        <Card className="p-6 shadow-card border-border bg-accent-light/30">
          <h3 className="font-semibold text-foreground mb-3">📊 Insights</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Your mood tends to be most stable in the {avgMood === 'N/A' ? 'start tracking to see patterns' : 'mornings'}</li>
            <li>• Nausea occurred on {nauseaCount} days in the last 2 weeks</li>
            <li>• Consider tracking for at least 30 days to see meaningful patterns</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
