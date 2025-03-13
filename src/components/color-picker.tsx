"use client";

import { useState } from "react";
import { EyeDropperIcon, PaintBucketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  icon?: React.ReactNode;
}

// Predefined color palette
const presetColors = [
  "#000000", "#ffffff", "#f44336", "#e91e63", "#9c27b0",
  "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4",
  "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b",
  "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"
];

export default function ColorPicker({ label, color, onChange, icon }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-8 px-3"
        >
          {icon || <PaintBucketIcon className="h-3.5 w-3.5" />}
          <span className="text-xs">{label}</span>
          <div
            className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: color || 'transparent' }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">{label}</h4>
            <input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="text-xs border rounded px-2 py-1 w-20"
            />
          </div>

          <div className="grid grid-cols-5 gap-1 mt-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className={`h-8 w-full rounded ${presetColor === color ? 'ring-2 ring-primary' : 'hover:scale-110'} transition-transform`}
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  onChange(presetColor);
                  setOpen(false);
                }}
                title={presetColor}
              />
            ))}
          </div>

          <div className="mt-4">
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 cursor-pointer rounded"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
