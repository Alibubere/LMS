import React from 'react';

export const Card = ({
  children,
  className = '',
  tone = 'light',
  padded = true,
  eyebrow,
  title,
  extra,
  footer,
  bodyClassName = '',
  ...rest
}) => {
  const isDark = tone === 'dark';
  const hasHeader = Boolean(extra || title || eyebrow);

  return (
    <section
      className={`${isDark ? 'card-dark' : 'card'} ${className}`}
      {...rest}
    >
      {hasHeader && (
        <header
          className={`flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5 ${
            isDark ? 'border-hairline-dark' : 'border-hairline'
          }`}
        >
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            {title && (
              <h3 className={`text-display-md truncate ${isDark ? 'text-on-dark' : 'text-ink'}`}>
                {title}
              </h3>
            )}
          </div>
          {extra && <div className="flex shrink-0 items-center gap-2">{extra}</div>}
        </header>
      )}

      <div className={padded ? `card-pad ${bodyClassName}` : bodyClassName}>{children}</div>

      {footer && (
        <footer
          className={`border-t px-6 py-5 ${
            isDark ? 'border-hairline-dark' : 'border-hairline'
          }`}
        >
          {footer}
        </footer>
      )}
    </section>
  );
};

export default Card;
