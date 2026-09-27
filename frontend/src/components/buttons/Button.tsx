import React, { type ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
  to?: never;
};

type ButtonAsLinkProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  to?: never;
};

type ButtonAsRouterLinkProps = BaseButtonProps & {
  to: string;
  href?: never;
} & Omit<React.ComponentProps<typeof Link>, 'to'>;

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps | ButtonAsRouterLinkProps;

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent',
  secondary: 'bg-brand-secondary text-white hover:bg-slate-800 border-transparent',
  accent: 'bg-brand-accent text-white hover:bg-orange-700 border-transparent',
  outline: 'bg-transparent text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white',
  ghost: 'bg-transparent text-content-secondary border-transparent hover:bg-surface-muted hover:text-content-primary',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center border font-medium rounded-md shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ('to' in props && props.to) {
    const { to, ...rest } = props as ButtonAsRouterLinkProps;
    return (
      <Link to={to} className={combinedClassName} {...rest}>
        {children}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsLinkProps;
    return (
      <a href={href} className={combinedClassName} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...(props as ButtonAsButtonProps)}>
      {children}
    </button>
  );
}
