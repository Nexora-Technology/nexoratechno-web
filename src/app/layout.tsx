import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nexora Technology Co., Ltd. | Software Technology Company.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}