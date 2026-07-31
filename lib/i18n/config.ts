import type { Locale } from "./types";

export const locales = ["es", "en"] as const;
export const defaultLocale: Locale = "es";
export const localeStorageKey = "emeorg-locale";
