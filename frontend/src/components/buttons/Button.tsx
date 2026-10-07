import React, { type ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outline-inverse' | 'ghost' | 'accent' | 'interactive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
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
  primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent hover:shadow-md',
  secondary: 'bg-brand-secondary text-white hover:bg-slate-800 border-transparent hover:shadow-md',
  accent: 'bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent hover:shadow-md',
  outline: 'bg-transparent text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white hover:border-transparent hover:shadow-md',
  'outline-inverse': 'bg-transparent text-white border-white/80 hover:bg-white hover:text-brand-primary hover:border-white hover:shadow-md',
  ghost: 'bg-transparent text-content-secondary border-transparent hover:bg-surface-muted hover:text-content-primary',
  interactive: 'bg-surface text-content-primary border-border hover:bg-brand-primary hover:text-white hover:border-brand-primary hover:shadow-md font-mono text-sm font-bold min-w-[140px] sm:min-w-[160px] gap-2',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-6 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base',
  lg: 'px-8 py-3.5 text-base md:text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  arrow = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isInteractive = variant === 'interactive';
  const baseStyles = 'inline-flex items-center justify-center border font-medium rounded-full shadow-sm transition-all duration-200 group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const renderContent = () => (
    <>
      {isInteractive && (
        <span className="text-brand-primary font-mono text-[1.15em] leading-none group-hover/btn:hidden transition-all shrink-0">
          ↗
        </span>
      )}
      <span>{children}</span>
      {isInteractive ? (
        <span className="hidden group-hover/btn:inline-block ml-[-2px] transition-all">
          →
        </span>
      ) : arrow ? (
        <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1.5 ml-2 font-mono text-[1.15em] leading-none">
          →
        </span>
      ) : null}
    </>
  );

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
          {renderContent()}
        </a>
      );
    }
    return (
      <Link to={to} className={combinedClassName} onClick={onClick} {...rest}>
        {renderContent()}
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
          {renderContent()}
        </a>
      );
    }
    return (
      <a href={href} className={combinedClassName} onClick={onClick} {...rest}>
        {renderContent()}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...(props as ButtonAsButtonProps)}>
      {renderContent()}
    </button>
  );
}
