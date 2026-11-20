import { useState, useMemo } from "react";

interface CalendarPickerProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateString: string) => void;
  maxDays?: number; // default 15
}

export function CalendarPicker({
  selectedDate,
  onSelectDate,
  maxDays = 15,
}: CalendarPickerProps) {
  // Base date setup
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxAllowedDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + (maxDays - 1));
    d.setHours(23, 59, 59, 999);
    return d;
  }, [today, maxDays]);

  // Current viewed month state
  const initialViewDate = useMemo(() => {
    if (selectedDate) {
      const parts = selectedDate.split("-");
      if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
      }
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }, [selectedDate, today]);

  const [viewDate, setViewDate] = useState<Date>(initialViewDate);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString("en-US", { month: "long" });

  // Check if we can navigate to previous / next month
  const canGoPrev = useMemo(() => {
    const firstDayOfPrevMonth = new Date(viewYear, viewMonth, 0); // last day of prev month
    return firstDayOfPrevMonth >= today;
  }, [viewYear, viewMonth, today]);

  const canGoNext = useMemo(() => {
    const firstDayOfNextMonth = new Date(viewYear, viewMonth + 1, 1);
    return firstDayOfNextMonth <= maxAllowedDate;
  }, [viewYear, viewMonth, maxAllowedDate]);

  const handlePrevMonth = () => {
    if (canGoPrev) {
      setViewDate(new Date(viewYear, viewMonth - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (canGoNext) {
      setViewDate(new Date(viewYear, viewMonth + 1, 1));
    }
  };

  // Generate calendar days grid
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun, 1 = Mon ...
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells: Array<{
      dayNumber: number;
      dateString: string;
      isCurrentMonth: boolean;
      isSelectable: boolean;
      isToday: boolean;
      isSelected: boolean;
    }> = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(viewYear, viewMonth - 1, dayNum);
      prevDate.setHours(0, 0, 0, 0);

      const y = prevDate.getFullYear();
      const m = String(prevDate.getMonth() + 1).padStart(2, "0");
      const d = String(dayNum).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;

      const isSelectable = prevDate >= today && prevDate <= maxAllowedDate;

      cells.push({
        dayNumber: dayNum,
        dateString: dateStr,
        isCurrentMonth: false,
        isSelectable,
        isToday: prevDate.getTime() === today.getTime(),
        isSelected: dateStr === selectedDate,
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const cellDate = new Date(viewYear, viewMonth, dayNum);
      cellDate.setHours(0, 0, 0, 0);

      const y = viewYear;
      const m = String(viewMonth + 1).padStart(2, "0");
      const d = String(dayNum).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;

      const isSelectable = cellDate >= today && cellDate <= maxAllowedDate;

      cells.push({
        dayNumber: dayNum,
        dateString: dateStr,
        isCurrentMonth: true,
        isSelectable,
        isToday: cellDate.getTime() === today.getTime(),
        isSelected: dateStr === selectedDate,
      });
    }

    // Next month padding to fill out 35 or 42 grid slots
    const totalCellsSoFar = cells.length;
    const remainingCells = totalCellsSoFar <= 35 ? 35 - totalCellsSoFar : 42 - totalCellsSoFar;

    for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
      const nextDate = new Date(viewYear, viewMonth + 1, dayNum);
      nextDate.setHours(0, 0, 0, 0);

      const y = nextDate.getFullYear();
      const m = String(nextDate.getMonth() + 1).padStart(2, "0");
      const d = String(dayNum).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;

      const isSelectable = nextDate >= today && nextDate <= maxAllowedDate;

      cells.push({
        dayNumber: dayNum,
        dateString: dateStr,
        isCurrentMonth: false,
        isSelectable,
        isToday: nextDate.getTime() === today.getTime(),
        isSelected: dateStr === selectedDate,
      });
    }

    return cells;
  }, [viewYear, viewMonth, today, maxAllowedDate, selectedDate]);

  // Formatted date string for the selected day
  const formattedSelected = useMemo(() => {
    if (!selectedDate) return "";
    const parts = selectedDate.split("-");
    if (parts.length !== 3) return selectedDate;
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-4 sm:p-5">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-white">{monthName}</span>
          <span className="text-sm font-medium text-white/50">{viewYear}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={!canGoPrev}
            className="p-1.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            aria-label="Previous month"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            disabled={!canGoNext}
            className="p-1.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            aria-label="Next month"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-[11px] font-semibold text-white/40 uppercase tracking-wider py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarCells.map((cell, idx) => {
          if (!cell.isSelectable) {
            return (
              <div
                key={idx}
                className="h-10 sm:h-11 rounded-xl flex items-center justify-center text-xs font-medium text-white/15 cursor-not-allowed select-none"
              >
                {cell.dayNumber}
              </div>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(cell.dateString)}
              className={`h-10 sm:h-11 rounded-xl flex flex-col items-center justify-center text-xs transition-all relative font-medium ${
                cell.isSelected
                  ? "bg-pink-500 text-white font-bold shadow-md shadow-pink-500/30 ring-2 ring-pink-500/60 z-10"
                  : "bg-black/40 border border-white/10 text-white/80 hover:border-pink-500/50 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <span>{cell.dayNumber}</span>
              {cell.isToday && (
                <span
                  className={`text-[9px] font-semibold leading-none mt-0.5 ${
                    cell.isSelected ? "text-white" : "text-pink-400"
                  }`}
                >
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date preview */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
        <div className="text-white/60">
          Selected Date: <span className="font-semibold text-white">{formattedSelected || "None"}</span>
        </div>
      </div>
    </div>
  );
}
