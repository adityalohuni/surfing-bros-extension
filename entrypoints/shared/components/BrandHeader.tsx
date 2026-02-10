import type { ReactNode } from 'react';

type BrandHeaderProps = {
  iconUrl: string;
  title: string;
  description?: string;
  rightSlot?: ReactNode;
};

export function BrandHeader({ iconUrl, title, description, rightSlot }: BrandHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <img className="brand-icon" src={iconUrl} alt={title} />
        <div>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
      {rightSlot ? <div className="row">{rightSlot}</div> : null}
    </div>
  );
}
