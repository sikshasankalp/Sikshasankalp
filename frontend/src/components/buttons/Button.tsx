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
  accent: 'bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent',
  outline: 'bg-transparent text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white',
  ghost: 'bg-transparent text-content-secondary border-transparent hover:bg-surface-muted hover:text-content-primary',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-7 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-base md:text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center border font-medium rounded-full shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    const id = hash.replace(/^#/, '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', hash);
    }
  };

  if ('to' in props && props.to) {
    const { to, onClick, ...rest } = props as ButtonAsRouterLinkProps;
    if (typeof to === 'string' && to.startsWith('#')) {
      return (
        <a
          href={to}
          className={combinedClassName}
          onClick={(e) => {
            if (onClick) (onClick as any)(e);
            if (!e.defaultPrevented) {
              handleHashClick(e, to);
            }
          }}
          {...(rest as any)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link to={to} className={combinedClassName} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const { href, onClick, ...rest } = props as ButtonAsLinkProps;
    if (typeof href === 'string' && href.startsWith('#') && href.length > 1) {
      return (
        <a
          href={href}
          className={combinedClassName}
          onClick={(e) => {
            if (onClick) onClick(e);
            if (!e.defaultPrevented) {
              handleHashClick(e, href);
            }
          }}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <a href={href} className={combinedClassName} onClick={onClick} {...rest}>
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
