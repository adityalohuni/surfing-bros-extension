import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'default';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const classForVariant: Record<ButtonVariant, string> = {
  primary: 'primary',
  secondary: 'secondary',
  default: '',
};

export function Button({ variant = 'default', className = '', children, ...props }: ButtonProps) {
  const variantClass = classForVariant[variant];
  return (
    <button className={[variantClass, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </button>
  );
}
