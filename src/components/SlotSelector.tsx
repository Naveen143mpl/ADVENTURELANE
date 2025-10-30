import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface Slot {
  id: string;
  date: string;
  time: string;
  available_spots: number;
  total_spots: number;
}

interface SlotSelectorProps {
  slots: Slot[];
  onSelectSlot: (slot: Slot) => void;
  selectedSlot: Slot | null;
}

export const SlotSelector = ({
  slots,
  onSelectSlot,
  selectedSlot,
}: SlotSelectorProps) => {
  const groupedSlots = slots.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Select Date & Time</h3>
      {Object.entries(groupedSlots).map(([date, dateSlots]) => (
        <Card key={date} className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-medium">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{format(new Date(date), "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dateSlots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                const isSoldOut = slot.available_spots === 0;
                
                return (
                  <Button
                    key={slot.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`relative h-auto flex-col items-start gap-2 p-4 ${
                      isSoldOut ? "opacity-50" : ""
                    }`}
                    onClick={() => !isSoldOut && onSelectSlot(slot)}
                    disabled={isSoldOut}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold">{slot.time}</span>
                      </div>
                      {isSoldOut && (
                        <Badge variant="destructive" className="text-xs">
                          Sold Out
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {isSoldOut
                        ? "No spots available"
                        : `${slot.available_spots} spots left`}
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
