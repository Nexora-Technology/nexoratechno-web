import type { ReactNode } from 'react';

/** Inline markup allowed in home copy messages (`t.rich`). */
export const rich = {
  br: () => <br />,
  em: (chunks: ReactNode) => <em>{chunks}</em>,
  span: (chunks: ReactNode) => <span>{chunks}</span>,
};

/** Split text into per-word spans for the scroll-driven word reveal. */
export function RevealWords({ text }: { text: string }) {
  return text.split(/(\s+)/).map((token, i) =>
    token.trim() ? (
      <span key={i} className="word-reveal">
        {token}
      </span>
    ) : (
      token
    )
  );
}
