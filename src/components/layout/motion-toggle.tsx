'use client';

import { useTranslations } from 'next-intl';
import { useMotion } from '@/components/providers/motion-provider';

export default function MotionToggle() {
  const t = useTranslations('site');
  const { reduced, toggle } = useMotion();
  return (
    <button type="button" aria-pressed={reduced} aria-label={t('motion_label')} onClick={toggle}>
      {reduced ? t('motion_off') : t('motion_on')}
    </button>
  );
}
