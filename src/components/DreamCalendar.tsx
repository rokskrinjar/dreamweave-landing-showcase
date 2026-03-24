import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Dream {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  tags: string[];
  recorded_at: string;
  created_at: string;
  hasAnalysis?: boolean;
}

interface DreamCalendarProps {
  dreams: Dream[];
  moodColors: Record<string, string>;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DreamCalendar = ({ dreams, moodColors }: DreamCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const dreamsByDate = useMemo(() => {
    const map = new Map<string, Dream[]>();
    for (const dream of dreams) {
      const key = format(new Date(dream.recorded_at), "yyyy-MM-dd");
      const arr = map.get(key) || [];
      arr.push(dream);
      map.set(key, arr);
    }
    return map;
  }, [dreams]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const start = startOfWeek(monthStart, { weekStartsOn: 1 });
    const end = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const selectedDreams = selectedDate
    ? dreamsByDate.get(format(selectedDate, "yyyy-MM-dd")) || []
    : [];

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const selected = selectedDate ? isSameDay(day, selectedDate) : false;
          const dayDreams = dreamsByDate.get(key);
          const count = dayDreams?.length || 0;
          const hasDreams = count > 0 && inMonth;

          let cellClass =
            "relative min-h-[3rem] rounded-lg p-2 flex items-center justify-center text-sm transition-colors ";

          if (!inMonth) {
            cellClass += "text-muted-foreground/30 cursor-default";
          } else {
            cellClass += "cursor-pointer hover:bg-accent/50 ";
            if (hasDreams && !today) cellClass += "bg-primary/10 ";
            if (today)
              cellClass += "ring-2 ring-primary text-primary font-bold ";
            if (selected && !today)
              cellClass += "ring-1 ring-muted-foreground/40 ";
            if (selected && today)
              cellClass += "ring-offset-2 ring-offset-background ";
          }

          return (
            <button
              key={key}
              className={cellClass}
              disabled={!inMonth}
              onClick={() => inMonth && setSelectedDate(day)}
            >
              {format(day, "d")}
              {hasDreams && (
                <span className="absolute top-1 right-1.5 text-[10px] font-bold text-primary">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-base font-semibold text-foreground mb-3">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h3>
          {selectedDreams.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No dreams recorded this day.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDreams.map((dream) => (
                <Link
                  key={dream.id}
                  to={`/dreams/${dream.id}`}
                  className="group block bg-card rounded-2xl p-5 border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-foreground truncate mb-1">
                        {dream.title}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        {dream.hasAnalysis ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            <Sparkles className="w-3 h-3" />
                            Analyzed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            Not analyzed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {dream.content}
                      </p>
                    </div>
                    {dream.mood && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          moodColors[dream.mood] ||
                          "bg-muted text-muted-foreground"
                        }`}
                      >
                        {dream.mood}
                      </span>
                    )}
                  </div>
                  {dream.tags && dream.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {dream.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DreamCalendar;
