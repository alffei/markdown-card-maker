"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThemeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

// Available themes
const themes = [
  { id: "default", name: "Default" },
  { id: "modern", name: "Modern" },
  { id: "minimal", name: "Minimal" },
  { id: "elegant", name: "Elegant" },
  { id: "vibrant", name: "Vibrant" },
  { id: "social", name: "Social Media" },
  { id: "blog", name: "Blog Post" },
  { id: "code", name: "Code" },
  // New themes
  { id: "nature", name: "Nature" },
  { id: "ocean", name: "Ocean" },
  { id: "sunset", name: "Sunset" },
  { id: "retro", name: "Retro" },
  { id: "newspaper", name: "Newspaper" },
  { id: "magazine", name: "Magazine" },
];

export default function ThemeSelector({ value, onValueChange }: ThemeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Theme:</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              {theme.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
