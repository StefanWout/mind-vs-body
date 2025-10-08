import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DailyEntry, PeriodStatus } from '@/types/tracking';
import { storage } from '@/lib/storage';
import { ScaleInput } from '@/components/ScaleInput';
import { ToggleInput } from '@/components/ToggleInput';
import { PeriodStatusSelect } from '@/components/PeriodStatusSelect';
import { TimeInput } from '@/components/TimeInput';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

export default function DailyLog() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  
  const [entry, setEntry] = useState<Partial<DailyEntry>>({
    date: today,
    periodStatus: null,
    nausea: null,
    nauseaTime: null,
    moodMorning: null,
    moodMidday: null,
    moodEvening: null,
  });

  useEffect(() => {
    const existingEntry = storage.getEntryByDate(today);
    if (existingEntry) {
      setEntry(existingEntry);
    }
  }, [today]);

  const handleSave = () => {
    const completeEntry: DailyEntry = {
      id: entry.id || `entry-${Date.now()}`,
      date: today,
      periodStatus: entry.periodStatus || null,
      nausea: entry.nausea || null,
      nauseaTime: entry.nauseaTime || null,
      moodMorning: entry.moodMorning || null,
      moodMidday: entry.moodMidday || null,
      moodEvening: entry.moodEvening || null,
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.saveEntry(completeEntry);
    toast.success('Entry saved successfully!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-soft pb-24">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Daily Log</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(today).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <Card className="p-6 space-y-6 shadow-card border-border">
          <PeriodStatusSelect
            value={entry.periodStatus || null}
            onChange={(value) => setEntry({ ...entry, periodStatus: value })}
            label="Period Status"
          />

          <ToggleInput
            value={entry.nausea || null}
            onChange={(value) => setEntry({ ...entry, nausea: value })}
            label="Experiencing Nausea?"
          />

          {entry.nausea && (
            <TimeInput
              value={entry.nauseaTime || null}
              onChange={(value) => setEntry({ ...entry, nauseaTime: value })}
              label="What time did nausea start?"
            />
          )}
        </Card>

        <Card className="p-6 space-y-6 shadow-card border-border">
          <h2 className="text-lg font-semibold text-foreground">Mood Throughout the Day</h2>
          
          <ScaleInput
            value={entry.moodMorning || null}
            onChange={(value) => setEntry({ ...entry, moodMorning: value })}
            label="Morning Mood"
          />

          <ScaleInput
            value={entry.moodMidday || null}
            onChange={(value) => setEntry({ ...entry, moodMidday: value })}
            label="Midday Mood"
          />

          <ScaleInput
            value={entry.moodEvening || null}
            onChange={(value) => setEntry({ ...entry, moodEvening: value })}
            label="Evening Mood"
          />
        </Card>

        <Button
          onClick={handleSave}
          className="w-full h-14 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:scale-105 transition-smooth"
        >
          <Save className="mr-2 h-5 w-5" />
          Save Entry
        </Button>
      </main>
    </div>
  );
}
