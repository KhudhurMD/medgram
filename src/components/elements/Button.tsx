import { ComponentProps } from 'react';

interface ButtonProps {
  label?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  variant?: 'primary' | 'secondary' | 'tertiary';
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
  href?: string;
  extraProps?: ComponentProps<'button'>;
}

export function Button({ children, label, size = 'md', variant = 'primary', icon, onClick, className, href, extraProps }: ButtonProps) {
  const commonClasses =
    'flex flex-row items-center justify-center gap-2 rounded-md transition-all disabled:bg-gray-200 disabled:text-gray-600 cursor-pointer';

  const sizeClasses = {
    sm: 'px-3 py-1 text-base',
    md: 'px-3 py-1 text-base',
    lg: 'px-4 py-3 text-lg',
    icon: 'p-2',
  };

  const colorClasses = {
    primary: 'bg-primary-700 text-white hover:opacity-95',
    secondary: 'bg-primary-50 font-medium text-primary-500 hover:bg-primary-100',
    tertiary: 'bg-transparent text-gray-700 hover:bg-gray-200',
  };

  return (
    <button type="submit" className={`${commonClasses} ${sizeClasses[size]} ${colorClasses[variant]} ${className}`} onClick={onClick} {...extraProps}>
      {icon && icon}
      {label && <span>{label}</span>}
      {children}
    </button>
  );
}
