import React, { useEffect, useRef, useState } from 'react';

interface ViewportImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export const ViewportImage: React.FC<ViewportImageProps> = ({
  wrapperClassName = 'absolute inset-0',
  ...imageProps
}) => {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const target = wrapperRef.current;
    if (!target) return;
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '150px 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={wrapperRef} className={wrapperClassName}>
      {shouldLoad && <img {...imageProps} loading="lazy" decoding="async" />}
    </span>
  );
};
