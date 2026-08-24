import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('flex min-h-36 w-full resize-none bg-transparent text-base leading-7 text-foreground outline-none placeholder:text-muted-foreground/55 disabled:opacity-50 sm:text-lg', className)} {...props} />
}
