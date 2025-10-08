import { cn } from '@/lib/utils';

interface ScaleInputProps {
  value: number | null;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}

export function ScaleInput({ value, onChange, label, min = 1, max = 5 }: ScaleInputProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-2 justify-between">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={cn(
              "flex-1 h-12 rounded-2xl font-medium transition-smooth",
              "hover:scale-105 active:scale-95",
              value === num
                ? "bg-gradient-primary text-primary-foreground shadow-soft"
                : "bg-card text-muted-foreground hover:bg-muted border border-border"
            )}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
