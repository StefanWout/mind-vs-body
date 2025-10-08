import { cn } from '@/lib/utils';

interface ToggleInputProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  label: string;
}

export function ToggleInput({ value, onChange, label }: ToggleInputProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            "flex-1 h-12 rounded-2xl font-medium transition-smooth",
            "hover:scale-105 active:scale-95",
            value === true
              ? "bg-gradient-primary text-primary-foreground shadow-soft"
              : "bg-card text-muted-foreground hover:bg-muted border border-border"
          )}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "flex-1 h-12 rounded-2xl font-medium transition-smooth",
            "hover:scale-105 active:scale-95",
            value === false
              ? "bg-gradient-primary text-primary-foreground shadow-soft"
              : "bg-card text-muted-foreground hover:bg-muted border border-border"
          )}
        >
          No
        </button>
      </div>
    </div>
  );
}
