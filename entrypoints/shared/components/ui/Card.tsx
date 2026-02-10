import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div className={['surface p-4', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
