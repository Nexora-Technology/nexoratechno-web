'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/providers/theme-provider';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Ho_Chi_Minh">
      <ThemeProvider>{children}</ThemeProvider>
    </NextIntlClientProvider>
  );
}