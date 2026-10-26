interface Props {
  items: { label: string; value?: string | number }[];
}

/** Mono meta strip for hero bands; entries without a value are skipped. */
export default function SubMeta({ items }: Props) {
  const shown = items.filter((i) => i.value !== undefined && i.value !== '');
  if (!shown.length) return null;
  return (
    <dl className="sub-meta">
      {shown.map((i) => (
        <div key={i.label}>
          <dt className="mono">{i.label}</dt>
          <dd>{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
