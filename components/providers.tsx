"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

import { LanguageProvider } from "@/components/language/language-provider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="emeorg-theme"
    >
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
