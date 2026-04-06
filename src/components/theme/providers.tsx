'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme()
  const pathname = usePathname()
  const onlyDarkThemePages = ["/builder"]

  useEffect(() => {
    const isDark = onlyDarkThemePages.includes(pathname)
    isDark ? setTheme("dark") : setTheme("light")
  }, [])
  return (
    <ThemeProvider  attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}
