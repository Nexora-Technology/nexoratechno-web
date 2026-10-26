// WordPress industries are free text and grow with every case study; filters
// group them into a few sectors so the bar fits one row. Unknown → 'other'.
export const SECTORS: { key: string; label: [vi: string, en: string]; industries: string[] }[] = [
  { key: 'finance', label: ['Tài chính', 'Finance'], industries: ['Fintech', 'Insurance'] },
  {
    key: 'industry',
    label: ['Công nghiệp', 'Industry'],
    industries: ['Manufacturing', 'Energy', 'Infrastructure', 'Automotive', 'Agriculture', 'GIS'],
  },
  {
    key: 'commerce',
    label: ['Thương mại', 'Commerce'],
    industries: [
      'E-commerce', 'Distribution', 'Logistics', 'Retail & F&B', 'F&B', 'Loyalty', 'Beauty Retail',
      'Real Estate', 'Hospitality', 'Food Manufacturing and E-commerce', 'Retail and Events',
      'Retail and Food',
    ],
  },
  { key: 'health', label: ['Y tế', 'Health'], industries: ['Healthcare', 'Biotech Compliance'] },
  {
    key: 'enterprise',
    label: ['Doanh nghiệp', 'Enterprise'],
    industries: [
      'Enterprise Software', 'Productivity SaaS', 'Service Tech', 'Web Services', 'Education',
      'Gaming', 'AI Data',
    ],
  },
  {
    key: 'travel',
    label: ['Du lịch & hàng hải', 'Travel & maritime'],
    industries: ['Travel', 'Maritime', 'Hospitality and Travel'],
  },
];

export const OTHER_SECTOR = { key: 'other', label: ['Khác', 'Other'] as [string, string] };

export function sectorOf(industry: string): string {
  return SECTORS.find((s) => s.industries.includes(industry))?.key ?? OTHER_SECTOR.key;
}

/** Sectors that actually have cases, in display order, with locale labels. */
export function presentSectors(industries: string[], locale: string) {
  const present = new Set(industries.map(sectorOf));
  const index = locale === 'vi' ? 0 : 1;
  return [...SECTORS, OTHER_SECTOR]
    .filter((s) => present.has(s.key))
    .map((s) => ({ key: s.key, label: s.label[index] }));
}
