import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Wrapper for page content in the authenticated layout.
 * Same structure as used in list pages (e.g. users): title block, actions, filters, error, table/form.
 */
export const Main = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function Main({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-1 flex-col gap-4 sm:gap-6', className)}
      {...props}
    />
  )
})
Main.displayName = 'Main'
