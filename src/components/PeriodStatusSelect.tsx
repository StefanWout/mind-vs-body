import { PeriodStatus } from '@/types/tracking';
import { cn } from '@/lib/utils';
import { Droplets, Wind, Zap, AlertCircle, Circle } from 'lucide-react';

interface PeriodStatusSelectProps {
  value: PeriodStatus | null;
  onChange: (value: PeriodStatus) => void;
  label: string;
}

const periodOptions: { value: PeriodStatus; label: string; icon: React.ReactNode }[] = [
  { value: 'heavy', label: 'Heavy', icon: <Droplets className="h-4 w-4" /> },
  { value: 'light', label: 'Light', icon: <Wind className="h-4 w-4" /> },
  { value: 'patchy', label: 'Patchy', icon: <Zap className="h-4 w-4" /> },
  { value: 'cramps', label: 'Just cramps', icon: <AlertCircle className="h-4 w-4" /> },
  { value: 'none', label: 'No period', icon: <Circle className="h-4 w-4" /> },
];

export function PeriodStatusSelect({ value, onChange, label }: PeriodStatusSelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-2 h-12 px-4 rounded-2xl font-medium transition-smooth",
              "hover:scale-105 active:scale-95",
              value === option.value
                ? "bg-gradient-primary text-primary-foreground shadow-soft"
                : "bg-card text-muted-foreground hover:bg-muted border border-border"
            )}
          >
            {option.icon}
            <span className="text-sm">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
