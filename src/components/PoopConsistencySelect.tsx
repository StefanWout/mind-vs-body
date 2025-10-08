import { PoopConsistency } from '@/types/tracking';
import { cn } from '@/lib/utils';
import { Droplets, Wind, Circle } from 'lucide-react';

interface PoopConsistencySelectProps {
  value: PoopConsistency | null;
  onChange: (value: PoopConsistency) => void;
  label: string;
}

const consistencyOptions: { value: PoopConsistency; label: string; icon: React.ReactNode }[] = [
  { value: 'liquid', label: 'Liquid', icon: <Droplets className="h-4 w-4" /> },
  { value: 'soft', label: 'Soft', icon: <Wind className="h-4 w-4" /> },
  { value: 'solid', label: 'Solid', icon: <Circle className="h-4 w-4" /> },
];

export function PoopConsistencySelect({ value, onChange, label }: PoopConsistencySelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-2">
        {consistencyOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 h-12 px-4 rounded-2xl font-medium transition-smooth",
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
