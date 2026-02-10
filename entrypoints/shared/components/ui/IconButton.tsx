import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function IconButton({ className = '', children, ...props }: IconButtonProps) {
  return (
    <button className={['icon-button', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </button>
  );
}
