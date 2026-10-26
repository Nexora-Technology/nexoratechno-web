// Contact form payload: validation and the HTML email body. Kept free of
// framework imports so `node --test` can exercise it directly.

export const BUDGETS = ['unsure', 'under-10k', '10k-50k', '50k-200k', 'over-200k'] as const;
export const BUDGET_LABELS: Record<(typeof BUDGETS)[number], string> = {
  unsure: 'Not sure yet',
  'under-10k': 'Under 10,000 USD',
  '10k-50k': '10,000–50,000 USD',
  '50k-200k': '50,000–200,000 USD',
  'over-200k': 'Over 200,000 USD',
};
export const SERVICES = ['Web / App', 'AI / Data', 'Dedicated team', 'Modernization', 'Other'] as const;

export interface ContactInput {
  name: string;
  email: string;
  company: string;
  message: string;
  budget: (typeof BUDGETS)[number];
  services: string[];
}

const LIMITS = { name: 120, email: 200, company: 160, message: 5000 };

const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

/** Returns a clean payload or an English error message for the API response. */
export function parseContact(body: unknown): { data: ContactInput } | { error: string } {
  const raw = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const data = {
    name: str(raw.name),
    email: str(raw.email),
    company: str(raw.company),
    message: str(raw.message),
    budget: (BUDGETS as readonly string[]).includes(str(raw.budget))
      ? (str(raw.budget) as ContactInput['budget'])
      : 'unsure',
    services: Array.isArray(raw.services)
      ? raw.services.filter((s): s is string => (SERVICES as readonly string[]).includes(s as string))
      : [],
  };
  if (!data.name) return { error: 'Name is required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: 'Valid email is required' };
  if (data.message.length < 10) return { error: 'Message must be at least 10 characters' };
  for (const [key, max] of Object.entries(LIMITS)) {
    if (data[key as keyof typeof LIMITS].length > max) return { error: `${key} is too long` };
  }
  return { data };
}

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  );
}

export function contactEmailHtml(input: ContactInput): string {
  const row = (label: string, value: string) =>
    value ? `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>` : '';
  return [
    '<h3>New Contact Form Submission</h3>',
    row('Name', input.name),
    row('Email', input.email),
    row('Company', input.company),
    row('Interested in', input.services.join(', ')),
    row('Budget', BUDGET_LABELS[input.budget]),
    '<p><strong>Message:</strong></p>',
    `<p>${escapeHtml(input.message).replace(/\n/g, '<br>')}</p>`,
  ].join('\n');
}

/** Header-safe subject line: no CR/LF from user input. */
export function contactSubject(input: ContactInput): string {
  return `[Nexora Contact] New inquiry from ${input.name.replace(/[\r\n]+/g, ' ')}`;
}
