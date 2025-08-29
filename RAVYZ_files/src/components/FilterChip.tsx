import { X } from "lucide-react";
import { cn } from "./ui/utils";

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
  removable?: boolean;
  className?: string;
}

export function FilterChip({ 
  label, 
  selected = false, 
  onToggle, 
  onRemove, 
  removable = false, 
  className 
}: FilterChipProps) {
  const handleClick = () => {
    if (onToggle) {
      onToggle();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
        {
          "bg-ravyz-orange text-white border-ravyz-orange": selected,
          "bg-white text-ravyz-gray-700 border-ravyz-gray-200 hover:border-ravyz-orange hover:text-ravyz-orange": !selected,
        },
        className
      )}
    >
      <span>{label}</span>
      {removable && (
        <X 
          className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" 
          onClick={handleRemove}
        />
      )}
    </button>
  );
}

interface FilterChipGroupProps {
  chips: Array<{
    id: string;
    label: string;
    selected?: boolean;
  }>;
  onChipToggle: (id: string) => void;
  className?: string;
}

export function FilterChipGroup({ chips, onChipToggle, className }: FilterChipGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => (
        <FilterChip
          key={chip.id}
          label={chip.label}
          selected={chip.selected}
          onToggle={() => onChipToggle(chip.id)}
        />
      ))}
    </div>
  );
}