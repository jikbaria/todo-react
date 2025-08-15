"use client";

import * as React from "react";
import { isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  cn,
  formatDueDateDisplay,
  formatDueDateData,
  parsedDueDateData,
} from "@/lib/utils";

export function DueDatePicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Set due date"
          className={cn(value === null && "text-gray-600")}
        >
          <CalendarIcon className="size-4" />
          <span>{formatDueDateDisplay(value)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <div className="flex flex-col gap-2">
          <Calendar
            mode="single"
            defaultMonth={value ? parsedDueDateData(value) : undefined}
            selected={value ? parsedDueDateData(value) : undefined}
            captionLayout="label"
            disabled={(date) => {
              return isBefore(date, startOfDay(new Date()));
            }}
            startMonth={new Date()}
            onSelect={(date) => {
              onChange(date ? formatDueDateData(date) : null);
              setOpen(false);
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
