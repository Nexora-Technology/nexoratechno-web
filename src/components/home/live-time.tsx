'use client';

import { useEffect, useState } from 'react';

const format = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());

/** Current time in Ho Chi Minh City; empty until mounted to avoid a hydration mismatch. */
export default function LiveTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    setTime(format());
    const id = setInterval(() => setTime(format()), 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <time className="live-time" suppressHydrationWarning>
      {time}
    </time>
  );
}
