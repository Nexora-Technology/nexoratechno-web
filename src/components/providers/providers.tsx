'use client';

import { NextIntlClientProvider } from 'next-intl';
import { MotionProvider } from '@/components/providers/motion-provider';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Ho_Chi_Minh">
      <MotionProvider>{children}</MotionProvider>
    </NextIntlClientProvider>
  );
}
