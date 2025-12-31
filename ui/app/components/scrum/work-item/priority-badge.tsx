// priority-badge.tsx
import { Badge } from "~/components/ui/badge";
import {
  ArrowDownIcon,
  MinusIcon,
  AlertTriangleIcon,
  FlameIcon,
  Equal,
  ChevronDown,
  ChevronsDown,
  ChevronUp,
  ChevronsUp,
} from "lucide-react";

interface PriorityBadgeProps {
  priority: number; // 1 a 5 (baja -> alta)
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  switch (priority) {
    case 1:
      return (
        <Badge
          variant="outline"
          className="border-emerald-300/60 bg-emerald-50 text-emerald-800
                     dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-200"
        >
          <ChevronsDown />
          Muy baja
        </Badge>
      );

    case 2:
      return (
        <Badge
          variant="outline"
          className="border-lime-300/60 bg-lime-50 text-lime-800
                     dark:border-lime-900/60 dark:bg-lime-950/20 dark:text-lime-200"
        >
          <ChevronDown />
          Baja
        </Badge>
      );

    case 3:
      return (
        <Badge
          variant="outline"
          className="border-slate-300/70 bg-slate-50 text-slate-800
                     dark:border-slate-700/70 dark:bg-slate-900/30 dark:text-slate-200"
        >
          <Equal />
          Media
        </Badge>
      );

    case 4:
      return (
        <Badge
          variant="outline"
          className="border-amber-300/60 bg-amber-50 text-amber-900
                     dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200"
        >
          <ChevronUp />
          Alta
        </Badge>
      );

    case 5:
      return (
        <Badge
          variant="outline"
          className="border-rose-300/60 bg-rose-50 text-rose-900
                     dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-200"
        >
          <ChevronsUp />
          Muy alta
        </Badge>
      );

    default:
      return (
        <Badge variant="outline" className="dark:border-slate-700 dark:bg-slate-900/20">
          Prioridad desconocida
        </Badge>
      );
  }
}
