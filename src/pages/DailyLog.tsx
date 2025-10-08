import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DailyEntry, PeriodStatus, PoopConsistency } from '@/types/tracking';
import { storage } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { ScaleInput } from '@/components/ScaleInput';
import { ToggleInput } from '@/components/ToggleInput';
import { PeriodStatusSelect } from '@/components/PeriodStatusSelect';
import { PoopConsistencySelect } from '@/components/PoopConsistencySelect';
import { NumberInput } from '@/components/NumberInput';
import { TimeInput } from '@/components/TimeInput';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

export default function DailyLog() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  
  const [entry, setEntry] = useState<Partial<DailyEntry>>({
    date: today,
    periodStatus: null,
    nausea: null,
    nauseaTime: null,
    moodMorning: null,
    moodMidday: null,
    moodEvening: null,
    poopQuantity: null,
    poopConsistency: null,
    sleepQuality: null,
    gotUpToPee: null,
    hadHeadache: null,
    headacheTime: null,
    tookMedication: null,
  });

  useEffect(() => {
    if (!loading && user) {
      loadEntry();
    }
  }, [loading, user, today]);

  const loadEntry = async () => {
    const existingEntry = await storage.getEntryByDate(today);
    if (existingEntry) {
      setEntry(existingEntry);
    }
  };

  const handleSave = async () => {
    const completeEntry: DailyEntry = {
      id: entry.id || `entry-${Date.now()}`,
      date: today,
      periodStatus: entry.periodStatus || null,
      nausea: entry.nausea || null,
      nauseaTime: entry.nauseaTime || null,
      moodMorning: entry.moodMorning || null,
      moodMidday: entry.moodMidday || null,
      moodEvening: entry.moodEvening || null,
      poopQuantity: entry.poopQuantity || null,
      poopConsistency: entry.poopConsistency || null,
      sleepQuality: entry.sleepQuality || null,
      gotUpToPee: entry.gotUpToPee || null,
      hadHeadache: entry.hadHeadache || null,
      headacheTime: entry.headacheTime || null,
      tookMedication: entry.tookMedication || null,
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await storage.saveEntry(completeEntry);
      toast.success('Entry saved successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to save entry');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
        </Card>

        <Card className="p-6 space-y-6 shadow-card border-border">
          <h2 className="text-lg font-semibold text-foreground">Digestive Health</h2>
          
          <NumberInput
            value={entry.poopQuantity || null}
            onChange={(value) => setEntry({ ...entry, poopQuantity: value })}
            label="Number of Poops"
            min={0}
            max={20}
          />

          <PoopConsistencySelect
            value={entry.poopConsistency || null}
            onChange={(value) => setEntry({ ...entry, poopConsistency: value })}
            label="Poop Consistency"
          />
        </Card>

        <Card className="p-6 space-y-6 shadow-card border-border">
          <h2 className="text-lg font-semibold text-foreground">Sleep & Nighttime</h2>
          
          <ScaleInput
            value={entry.sleepQuality || null}
            onChange={(value) => setEntry({ ...entry, sleepQuality: value })}
            label="Sleep Quality"
          />

          <ToggleInput
            value={entry.gotUpToPee || null}
            onChange={(value) => setEntry({ ...entry, gotUpToPee: value })}
            label="Got Up to Pee?"
          />
        </Card>

        <Card className="p-6 space-y-6 shadow-card border-border">
          <h2 className="text-lg font-semibold text-foreground">Pain & Discomfort</h2>
          
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

          <ToggleInput
            value={entry.hadHeadache || null}
            onChange={(value) => setEntry({ ...entry, hadHeadache: value })}
            label="Had a Headache?"
          />

          {entry.hadHeadache && (
            <TimeInput
              value={entry.headacheTime || null}
              onChange={(value) => setEntry({ ...entry, headacheTime: value })}
              label="What time did headache start?"
            />
          )}

          <ToggleInput
            value={entry.tookMedication || null}
            onChange={(value) => setEntry({ ...entry, tookMedication: value })}
            label="Remembered to Take Medications?"
          />
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
