'use client';

import { getCookie } from '@/utils/cookies';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ThemeController() {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  const onlyDarkThemePages = ["/builder", "/builder-streams"];

  useEffect(() => {
    // ✅ set axios defaults once
    axios.defaults.validateStatus = (status) => status < 500;

    const token = getCookie("authToken"); // your cookie name

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const isDark = onlyDarkThemePages.includes(pathname);
    isDark && setTheme("dark");
  }, [pathname]); // ✅ important

  return null;
}