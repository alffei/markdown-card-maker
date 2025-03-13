"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import enTranslations from "./en.json";
import zhTranslations from "./zh.json";
import jaTranslations from "./ja.json";

// 定义支持的语言
export type Language = "en" | "zh" | "ja";

// 翻译资源
const resources = {
  en: enTranslations,
  zh: zhTranslations,
  ja: jaTranslations,
};

// 创建国际化上下文
interface I18nContextType {
  t: (key: string, params?: Record<string, string>) => string;
  language: Language;
  changeLanguage: (lang: Language) => void;
  getDefaultMarkdown: () => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// 检测用户的浏览器首选语言
const detectUserLanguage = (): Language => {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language.split("-")[0];

  if (browserLang === "zh") return "zh";
  if (browserLang === "ja") return "ja";

  return "en";
};

// 国际化提供者组件
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // 在客户端加载时检测用户语言
  useEffect(() => {
    // 首先检查本地存储是否有保存的语言偏好
    const savedLang = localStorage.getItem("preferred-language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "zh" || savedLang === "ja")) {
      setLanguage(savedLang);
    } else {
      // 如果没有保存的偏好，则使用浏览器语言
      const detectedLang = detectUserLanguage();
      setLanguage(detectedLang);
    }
  }, []);

  // 更改语言的函数
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("preferred-language", lang);
  };

  // 翻译函数
  const t = (key: string, params?: Record<string, string>) => {
    // 根据键获取翻译
    const keys = key.split(".");
    let translation: any = resources[language];

    for (const k of keys) {
      if (!translation[k]) {
        // 如果没有找到翻译，则使用英语作为备选
        translation = resources.en;
        for (const fallbackKey of keys) {
          translation = translation[fallbackKey];
          if (!translation) break;
        }
        break;
      }
      translation = translation[k];
    }

    if (typeof translation !== "string") {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    // 处理参数替换
    if (params) {
      return Object.keys(params).reduce(
        (str, param) => str.replace(new RegExp(`{${param}}`, "g"), params[param]),
        translation
      );
    }

    return translation;
  };

  // 获取默认Markdown内容
  const getDefaultMarkdown = () => {
    return resources[language].defaultMarkdown || resources.en.defaultMarkdown;
  };

  return (
    <I18nContext.Provider value={{ t, language, changeLanguage, getDefaultMarkdown }}>
      {children}
    </I18nContext.Provider>
  );
}

// 使用国际化的自定义钩子
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
