import { Input } from '@/components/ui/input';

interface NumberInputProps {
  value: number | null;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}

export function NumberInput({ value, onChange, label, min = 0, max = 20 }: NumberInputProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        type="number"
        min={min}
        max={max}
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value ? parseInt(e.target.value, 10) : 0;
          onChange(val);
        }}
        className="h-12 rounded-2xl border-border bg-card text-foreground"
      />
    </div>
  );
}
