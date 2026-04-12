import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

// Utility for merging tailwind classes safely
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-splitx-card/50', className)}
      {...props}
    />
  )
}
