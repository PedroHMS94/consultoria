import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const variantStyles = {
  default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-md',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50',
  ghost: 'hover:bg-gray-100',
  link: 'text-blue-600 underline-offset-4 hover:underline',
};

const sizeStyles = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-11 px-8 text-lg',
  icon: 'h-10 w-10',
};

export function buttonVariants(
  props?: {
    variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
) {
  const variant = props?.variant ?? 'default';
  const size = props?.size ?? 'default';
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  return cn(baseStyles, variantStyles[variant], sizeStyles[size]);
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
