'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  /**
   * Optional indicator color
   */
  color?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, color, ...props }, ref) => {
    // Ensure max is a valid positive number
    const safeMax = typeof max === 'number' && max > 0 ? max : 100;
    
    // Ensure value is a valid number between 0 and safeMax
    const safeValue = typeof value === 'number' && !isNaN(value) 
      ? Math.max(0, Math.min(safeMax, value)) 
      : 0;
    
    // Calculate percentage for the width
    const percentage = (safeValue / safeMax) * 100;
    
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
        className={cn(
          'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
          className
        )}
        {...props}
      >
        <div 
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
