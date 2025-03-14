"use client";

import Link from "next/link";
import { BookIcon, GithubIcon } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import LanguageSelector from "./language-selector";
import { useI18n } from "@/i18n/i18n-provider";

export default function Navbar() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <BookIcon className="h-6 w-6" />
          <Link href="/" className="flex items-center text-lg font-bold">
            {t("app.title")}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button variant="outline" size="icon" asChild>
            <Link href="https://github.com/alffei/markdown-card-maker" target="_blank" rel="noreferrer">
              <GithubIcon className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
