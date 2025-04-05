
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange as ReactDateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

interface DateRangeProps {
  onChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  value?: { from: Date | undefined; to: Date | undefined };
  className?: string;
}

export const DateRange: React.FC<DateRangeProps> = ({
  onChange,
  value = { from: undefined, to: undefined },
  className
}) => {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value.from ? (
              value.to ? (
                <>
                  {format(value.from, 'MMM d, yyyy')} -{' '}
                  {format(value.to, 'MMM d, yyyy')}
                </>
              ) : (
                format(value.from, 'MMM d, yyyy')
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value.from}
            selected={{ from: value.from, to: value.to }}
            onSelect={onChange}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
