import { cn } from "@/lib/utils";

interface ScaleInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

const ScaleInput = ({ value, onChange, min = 1, max = 5, minLabel, maxLabel }: ScaleInputProps) => {
  const points = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {points.map((point) => (
          <button
            key={point}
            type="button"
            onClick={() => onChange(point)}
            className={cn(
              "w-11 h-11 rounded-lg border-2 text-sm font-medium transition-all duration-200",
              value === point
                ? "border-primary bg-primary text-primary-foreground shadow-md"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {point}
          </button>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
};

export default ScaleInput;
