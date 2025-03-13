"use client";

import { useI18n, Language } from "@/i18n/i18n-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { GlobeIcon, CheckIcon } from "lucide-react";

export default function LanguageSelector() {
  const { language, changeLanguage, t } = useI18n();

  // 显示当前语言的简写
  const getLanguageDisplay = (lang: Language) => {
    switch (lang) {
      case "en":
        return "EN";
      case "zh":
        return "中";
      case "ja":
        return "日";
      default:
        return "EN";
    }
  };

  // 选择语言
  const handleLanguageChange = (newLang: Language) => {
    if (newLang !== language) {
      changeLanguage(newLang);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="flex items-center gap-1 w-auto px-2">
          <GlobeIcon className="h-4 w-4" />
          <span className="text-xs font-medium">{getLanguageDisplay(language)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className="flex justify-between"
        >
          <span>{t("langNames.en")}</span>
          {language === "en" && <CheckIcon className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("zh")}
          className="flex justify-between"
        >
          <span>{t("langNames.zh")}</span>
          {language === "zh" && <CheckIcon className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("ja")}
          className="flex justify-between"
        >
          <span>{t("langNames.ja")}</span>
          {language === "ja" && <CheckIcon className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
