import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { DailyEntry } from '@/types/tracking';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, TrendingUp, Activity, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type DateRange = 'week' | 'month' | 'all';

interface MetricOverlay {
  id: string;
  label: string;
  dataKey: string;
  color: string;
  strokeDasharray?: string;
}

export default function Trends() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set());

  const overlayMetrics: MetricOverlay[] = [
    { id: 'morningProd', label: 'Morning Productivity', dataKey: 'morningProductivity', color: 'hsl(var(--chart-1))', strokeDasharray: '5 5' },
    { id: 'afternoonProd', label: 'Afternoon Productivity', dataKey: 'afternoonProductivity', color: 'hsl(var(--chart-2))', strokeDasharray: '3 3' },
    { id: 'office', label: 'Office Attendance', dataKey: 'officeAttendance', color: 'hsl(var(--chart-3))', strokeDasharray: '8 2' },
    { id: 'sleep', label: 'Sleep Quality', dataKey: 'sleepQuality', color: 'hsl(var(--chart-4))', strokeDasharray: '1 3' },
  ];

  const toggleOverlay = (id: string) => {
    setActiveOverlays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (!loading && user) {
      loadEntries();
    }
  }, [loading, user]);

  const loadEntries = async () => {
    const allEntries = await storage.getEntries();
    setEntries(allEntries);
  };

  const daysToShow = useMemo(() => {
    switch (dateRange) {
      case 'week': return 7;
      case 'month': return 30;
      case 'all': return entries.length;
      default: return 30;
    }
  }, [dateRange, entries.length]);

  const moodData = useMemo(() => {
    return entries
      .slice(0, daysToShow)
      .reverse()
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
        morning: entry.moodMorning || null,
        midday: entry.moodMidday || null,
        evening: entry.moodEvening || null,
        morningProductivity: entry.morningProductivity || null,
        afternoonProductivity: entry.afternoonProductivity || null,
        officeAttendance: entry.wentToOffice ? 1 : 0,
        sleepQuality: entry.sleepQuality || null,
      }));
  }, [entries, daysToShow]);

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
      .slice(0, daysToShow)
      .flatMap(e => [e.moodMorning, e.moodMidday, e.moodEvening])
      .filter((m): m is number => m !== null);
    return moods.length > 0 ? (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1) : 'N/A';
  }, [entries, daysToShow]);

  const downloadCSV = () => {
    const headers = [
      'Date',
      'Period Status',
      'Nausea',
      'Nausea Time',
      'Mood Morning',
      'Mood Midday',
      'Mood Evening',
      'Morning Productivity',
      'Afternoon Productivity',
      'Poop Quantity',
      'Poop Consistency',
      'Sleep Quality',
      'Got Up To Pee',
      'Pee Time',
      'Had Headache',
      'Headache Time',
      'Took Medication',
      'Went To Office',
      'Went To Gym',
      'Gym Intensity',
      'Notes'
    ];

    const rows = entries.map(entry => [
      entry.date,
      entry.periodStatus || '',
      entry.nausea ? 'Yes' : 'No',
      entry.nauseaTime || '',
      entry.moodMorning || '',
      entry.moodMidday || '',
      entry.moodEvening || '',
      entry.morningProductivity || '',
      entry.afternoonProductivity || '',
      entry.poopQuantity || '',
      entry.poopConsistency || '',
      entry.sleepQuality || '',
      entry.gotUpToPee ? 'Yes' : 'No',
      entry.peeTime || '',
      entry.hadHeadache ? 'Yes' : 'No',
      entry.headacheTime || '',
      entry.tookMedication ? 'Yes' : 'No',
      entry.wentToOffice ? 'Yes' : 'No',
      entry.wentToGym ? 'Yes' : 'No',
      entry.gymIntensity || '',
      entry.notes ? `"${entry.notes.replace(/"/g, '""')}"` : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wellness-tracker-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-soft pb-24">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
              <p className="text-sm text-muted-foreground">
                {dateRange === 'week' ? 'Last 7 days' : dateRange === 'month' ? 'Last 30 days' : `All ${entries.length} days`}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCSV}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Mood & Correlations</h2>
            <div className="flex gap-2">
              <Button
                variant={dateRange === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateRange('week')}
              >
                Week
              </Button>
              <Button
                variant={dateRange === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateRange('month')}
              >
                Month
              </Button>
              <Button
                variant={dateRange === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateRange('all')}
              >
                All
              </Button>
            </div>
          </div>

          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">Overlay Filters:</p>
            <div className="grid grid-cols-2 gap-3">
              {overlayMetrics.map(metric => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={metric.id}
                    checked={activeOverlays.has(metric.id)}
                    onCheckedChange={() => toggleOverlay(metric.id)}
                  />
                  <label
                    htmlFor={metric.id}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {metric.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
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
              {/* Mood lines - always visible */}
              <Line 
                type="monotone" 
                dataKey="morning" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                name="Mood: Morning"
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="midday" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                name="Mood: Midday"
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="evening" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                name="Mood: Evening"
                connectNulls
              />
              {/* Overlay lines - conditional */}
              {overlayMetrics.map(metric => 
                activeOverlays.has(metric.id) && (
                  <Line
                    key={metric.id}
                    type="monotone"
                    dataKey={metric.dataKey}
                    stroke={metric.color}
                    strokeWidth={2}
                    strokeDasharray={metric.strokeDasharray}
                    dot={{ r: 3 }}
                    name={metric.label}
                    connectNulls
                  />
                )
              )}
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Legend:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-primary" />
                <span className="text-muted-foreground">Mood: Morning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-secondary" />
                <span className="text-muted-foreground">Mood: Midday</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-accent" />
                <span className="text-muted-foreground">Mood: Evening</span>
              </div>
              {overlayMetrics.map(metric => 
                activeOverlays.has(metric.id) && (
                  <div key={metric.id} className="flex items-center gap-2">
                    <svg width="24" height="2" className="flex-shrink-0">
                      <line
                        x1="0"
                        y1="1"
                        x2="24"
                        y2="1"
                        stroke={metric.color}
                        strokeWidth="2"
                        strokeDasharray={metric.strokeDasharray}
                      />
                    </svg>
                    <span className="text-muted-foreground">{metric.label}</span>
                  </div>
                )
              )}
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
            <li>• Your average mood is {avgMood} across all tracked periods</li>
            <li>• Nausea occurred on {nauseaCount} days in the selected range</li>
            <li>• Toggle overlay filters above to see how mood correlates with sleep, productivity, and office attendance</li>
            <li>• Consider tracking for at least 30 days to see meaningful patterns</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
