
import * as React from "react";
import { format } from "date-fns";
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
}

export function DatePickerWithRange({
  date,
  onDateChange,
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
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
              <span>Select date range</span>
            )}
            {date?.from && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-6 w-6 p-0 text-gray-500 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onDateChange(undefined);
                }}
              >
                <X size={16} />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            className="border-b border-gray-100"
          />
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
