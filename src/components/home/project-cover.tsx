'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  className: string;
  image?: string;
  alt: string;
  coverLabel: string;
  artLabel: string;
  children: ReactNode;
}

/** Project artwork: CSS illustration first, swapped for the published cover once it loads. */
export default function ProjectCover({ className, image, alt, coverLabel, artLabel, children }: Props) {
  const img = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // An SSR'd image can finish loading before hydration attaches onLoad.
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth > 0) setLoaded(true);
  }, []);

  const hasCover = loaded && !failed;
  return (
    <div className={`project-art ${className}${hasCover ? ' has-production-cover' : ''}`}>
      {children}
      {image && !failed && (
        // eslint-disable-next-line @next/next/no-img-element -- CMS image served by WordPress
        <img
          ref={img}
          className="production-cover"
          src={image}
          alt={alt}
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      <span className="art-bottom mono">{hasCover ? coverLabel : artLabel}</span>
    </div>
  );
}
