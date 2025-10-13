import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Save, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DailyLog() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const today = new Date().toISOString().split('T')[0];
  
  const [selectedDate, setSelectedDate] = useState<Date>(
    dateParam ? new Date(dateParam) : new Date()
  );
  const [entry, setEntry] = useState<Partial<DailyEntry>>({
    date: today,
    periodStatus: null,
    nausea: null,
    nauseaTime: null,
    moodMorning: null,
    moodMidday: null,
    moodEvening: null,
    morningProductivity: null,
    afternoonProductivity: null,
    poopQuantity: null,
    poopConsistency: null,
    sleepQuality: null,
    gotUpToPee: null,
    peeTime: null,
    hadHeadache: null,
    headacheTime: null,
    tookMedication: null,
    wentToOffice: null,
    notes: null,
  });

  useEffect(() => {
    if (!loading && user) {
      loadEntry();
    }
  }, [loading, user, selectedDate]);

  const loadEntry = async () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const existingEntry = await storage.getEntryByDate(dateString);
    if (existingEntry) {
      setEntry(existingEntry);
    } else {
      // Reset entry for new date
      setEntry({
        date: dateString,
        periodStatus: null,
        nausea: null,
        nauseaTime: null,
        moodMorning: null,
        moodMidday: null,
        moodEvening: null,
        morningProductivity: null,
        afternoonProductivity: null,
        poopQuantity: null,
        poopConsistency: null,
        sleepQuality: null,
        gotUpToPee: null,
        peeTime: null,
        hadHeadache: null,
        headacheTime: null,
        tookMedication: null,
        wentToOffice: null,
        notes: null,
      });
    }
  };

  const handleSave = async () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const completeEntry: DailyEntry = {
      id: entry.id || `entry-${Date.now()}`,
      date: dateString,
      periodStatus: entry.periodStatus || null,
      nausea: entry.nausea || null,
      nauseaTime: entry.nauseaTime || null,
      moodMorning: entry.moodMorning || null,
      moodMidday: entry.moodMidday || null,
      moodEvening: entry.moodEvening || null,
      morningProductivity: entry.morningProductivity || null,
      afternoonProductivity: entry.afternoonProductivity || null,
      poopQuantity: entry.poopQuantity || null,
      poopConsistency: entry.poopConsistency || null,
      sleepQuality: entry.sleepQuality || null,
      gotUpToPee: entry.gotUpToPee || null,
      peeTime: entry.peeTime || null,
      hadHeadache: entry.hadHeadache || null,
      headacheTime: entry.headacheTime || null,
      tookMedication: entry.tookMedication || null,
      wentToOffice: entry.wentToOffice || null,
      notes: entry.notes || null,
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
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Daily Log</h1>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-auto p-0 text-sm text-muted-foreground hover:text-foreground font-normal hover:bg-transparent",
                    "flex items-center gap-1"
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
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

          {entry.gotUpToPee && (
            <TimeInput
              value={entry.peeTime || null}
              onChange={(value) => setEntry({ ...entry, peeTime: value })}
              label="What time did you get up to pee?"
            />
          )}
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
          <h2 className="text-lg font-semibold text-foreground">Work</h2>
          
          <ToggleInput
            value={entry.wentToOffice || null}
            onChange={(value) => setEntry({ ...entry, wentToOffice: value })}
            label="Did I Go Into the Office?"
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

        <Card className="p-6 space-y-6 shadow-card border-border">
          <h2 className="text-lg font-semibold text-foreground">Productivity Throughout the Day</h2>
          
          <ScaleInput
            value={entry.morningProductivity || null}
            onChange={(value) => setEntry({ ...entry, morningProductivity: value })}
            label="Morning Productivity"
          />

          <ScaleInput
            value={entry.afternoonProductivity || null}
            onChange={(value) => setEntry({ ...entry, afternoonProductivity: value })}
            label="Afternoon Productivity"
          />
        </Card>

        <Card className="p-6 space-y-6 shadow-card border-border">
          <PeriodStatusSelect
            value={entry.periodStatus || null}
            onChange={(value) => setEntry({ ...entry, periodStatus: value })}
            label="Period Status"
          />
        </Card>

        <Card className="p-6 space-y-3 shadow-card border-border">
          <h2 className="text-lg font-semibold text-foreground">Additional Notes</h2>
          <Textarea
            value={entry.notes || ''}
            onChange={(e) => setEntry({ ...entry, notes: e.target.value })}
            placeholder="Add any additional notes or observations about your day..."
            className="min-h-[120px] rounded-2xl border-border bg-card text-foreground resize-none"
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
