import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium sm:px-2.5 sm:py-0.5',
  {
    variants: {
      variant: {
        default: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800',
        outline: 'border border-gray-200 text-gray-800',
      },
      size: {
        default: 'text-xs',
        sm: 'text-xs px-1.5 py-0.5 sm:px-2 sm:py-0.5',
        lg: 'text-sm px-2.5 py-1 sm:px-3 sm:py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Badge = ({ className, variant, size, ...props }) => {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export default Badge;