import { Input } from '@/components/ui/input';

interface TimeInputProps {
  value: string | null;
  onChange: (value: string) => void;
  label: string;
}

export function TimeInput({ value, onChange, label }: TimeInputProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        type="time"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-2xl border-border bg-card text-foreground"
      />
    </div>
  );
}
