import { LanguageSelect } from '@/components/language/language-select';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <ThemeToggle />
        <LanguageSelect />
      </div>
    </footer>
  );
}
