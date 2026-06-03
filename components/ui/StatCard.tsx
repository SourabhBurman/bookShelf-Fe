import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number; // positive = up, negative = down, undefined = none
  trendLabel?: string;
  className?: string;
  variant?: "default" | "purple" | "blue" | "emerald" | "amber";
}

const variantStyles = {
  default: "bg-zinc-900/50 border-white/5",
  purple: "bg-purple-950/20 border-purple-500/20",
  blue: "bg-blue-950/20 border-blue-500/20",
  emerald: "bg-emerald-950/20 border-emerald-500/20",
  amber: "bg-amber-950/20 border-amber-500/20",
};

const iconStyles = {
  default: "bg-zinc-800 text-zinc-400",
  purple: "bg-purple-500/20 text-purple-400",
  blue: "bg-blue-500/20 text-blue-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
  amber: "bg-amber-500/20 text-amber-400",
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  className,
  variant = "default",
}: StatCardProps) {
  return (
    <Card className={cn("backdrop-blur-xl transition-all hover:scale-[1.02] duration-300 p-0 gap-0", variantStyles[variant], className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">{title}</p>
            <h3 className="text-2xl font-bold text-white mt-1 tracking-tight">{value}</h3>
          </div>
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5", iconStyles[variant])}>
            {icon}
          </div>
        </div>
        
        {(trend !== undefined || trendLabel) && (
          <div className="mt-3 flex items-center text-xs">
            {trend !== undefined && (
              <span
                className={cn(
                  "flex items-center font-medium",
                  trend > 0 ? "text-emerald-400" : trend < 0 ? "text-rose-400" : "text-zinc-400"
                )}
              >
                {trend > 0 ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : trend < 0 ? (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                ) : null}
                {Math.abs(trend)}%
              </span>
            )}
            {trendLabel && (
              <span className="ml-2 text-zinc-500">{trendLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
