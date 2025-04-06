
import * as React from "react";
import { format, isAfter, isBefore, isEqual } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Typography } from "@/components/ui";

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  align?: "start" | "center" | "end";
  minDate?: Date;
  maxDate?: Date;
}

export function DatePickerWithRange({
  date,
  onDateChange,
  className,
  placeholder = "Select date range",
  disabled = false,
  align = "end",
  minDate,
  maxDate,
}: DatePickerWithRangeProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Custom preset date ranges
  const presets = [
    {
      name: "Today",
      getValue: () => {
        const today = new Date();
        return { from: today, to: today };
      },
    },
    {
      name: "This Week",
      getValue: () => {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        const end = new Date(today);
        end.setDate(start.getDate() + 6);
        return { from: start, to: end };
      },
    },
    {
      name: "This Month",
      getValue: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { from: start, to: end };
      },
    },
    {
      name: "Next Month",
      getValue: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        return { from: start, to: end };
      },
    },
    {
      name: "This Season",
      getValue: () => {
        const today = new Date();
        // Assuming season runs from August to May
        let startYear = today.getFullYear();
        let endYear = today.getFullYear() + 1;
        if (today.getMonth() < 7) { // If before August
          startYear = today.getFullYear() - 1;
          endYear = today.getFullYear();
        }
        return { 
          from: new Date(startYear, 7, 1), // August 1st
          to: new Date(endYear, 4, 31), // May 31st
        };
      },
    },
  ];

  // Clear date range
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(undefined);
  };

  // Handle preset selection
  const handlePresetClick = (preset: { name: string; getValue: () => DateRange }) => {
    const range = preset.getValue();
    onDateChange(range);
    setIsCalendarOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
            {date?.from && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-6 w-6 p-0 text-gray-500 hover:bg-transparent"
                onClick={handleClear}
              >
                <X size={16} />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="flex">
            <div className="p-2 border-r border-gray-100">
              <div className="px-3 py-2 text-sm font-medium">
                Quick Select
              </div>
              <div className="flex flex-col gap-1 p-1">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-sm"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={2}
              disabled={(date) => {
                if (minDate && isBefore(date, minDate)) return true;
                if (maxDate && isAfter(date, maxDate)) return true;
                return false;
              }}
              className="border-b border-gray-100 pointer-events-auto"
            />
          </div>
          <div className="p-3 border-t flex justify-between items-center">
            <Typography.Small className="text-muted-foreground">
              Select start and end dates
            </Typography.Small>
            <Button 
              size="sm"
              variant="ghost"
              className="text-sm"
              onClick={() => onDateChange(undefined)}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
