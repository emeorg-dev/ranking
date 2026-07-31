import { en } from "./dictionaries/en";
import { es } from "./dictionaries/es";
import type { Locale, TranslationDictionary } from "./types";

export type { Locale as LangCode, Locale, TranslationDictionary };

export interface LanguageOption {
  code: Locale;
  label: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

export const SUPPORTED_LOCALES = ["es", "en"] as const;
export const DEFAULT_LOCALE: Locale = "es";

const SUPPORTED_LOCALES_SET = new Set<string>(SUPPORTED_LOCALES);

export function isSupportedLocale(locale: unknown): locale is Locale {
  return typeof locale === "string" && SUPPORTED_LOCALES_SET.has(locale);
}

export const dictionaries: Record<Locale, TranslationDictionary> = {
  es,
  en,
};

// Utility to get a deeply nested property using dot notation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNestedTranslation(obj: any, path: string): string {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj) || path;
}
