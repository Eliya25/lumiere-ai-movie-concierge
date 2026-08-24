import { Skeleton } from '@/components/ui/skeleton'

export function MovieSkeleton() {
  return <div aria-hidden="true"><Skeleton className="aspect-[2/3] rounded-[1.15rem]" /><div className="space-y-3 px-1 pt-5"><Skeleton className="h-3 w-24" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></div></div>
}
