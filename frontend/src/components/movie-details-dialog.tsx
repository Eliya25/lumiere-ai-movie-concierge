import { ExternalLink, Play, Star, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { Movie } from '@/data/movies'

type Props = { movie: Movie; open: boolean; onOpenChange: (open: boolean) => void }

export function MovieDetailsDialog({ movie, open, onOpenChange }: Props) {
  const rating = movie.tmdbRating ?? movie.rating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className='relative min-h-64 overflow-hidden rounded-t-3xl sm:min-h-80'>
          {movie.backdropUrl ? <img src={movie.backdropUrl} alt='' className='absolute inset-0 h-full w-full object-cover' /> : <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#70273b,#25171b_48%,#100d0e)]' />}
          <div className='absolute inset-0 bg-gradient-to-t from-[#100d0e] via-[#100d0e]/35 to-black/20' aria-hidden='true' />
          <div className='relative flex min-h-64 items-end p-6 sm:min-h-80 sm:p-9'>
            <div>
              <div className='mb-4 flex flex-wrap gap-2'>{movie.genre.map((genre) => <Badge key={genre}>{genre}</Badge>)}</div>
              <DialogTitle>{movie.title}</DialogTitle>
              <div className='mt-3 flex flex-wrap items-center gap-4 text-sm text-white/65'>
                <span>{movie.year}</span><span className='flex items-center gap-1.5 font-semibold text-white'><Star className='size-4 fill-primary text-primary' aria-hidden='true' />{rating.toFixed(1)}</span>{movie.voteCount ? <span>{movie.voteCount.toLocaleString()} TMDB votes</span> : null}
              </div>
              {movie.trailerUrl ? <a href={movie.trailerUrl} target='_blank' rel='noopener noreferrer' className='mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_12px_35px_-12px_var(--color-primary)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#100d0e]'><Play className='size-4 fill-current' aria-hidden='true' />Watch trailer<ExternalLink className='size-3.5 opacity-65' aria-hidden='true' /><span className='sr-only'> on YouTube, opens in a new tab</span></a> : null}
            </div>
          </div>
        </div>
        <div className='grid gap-8 p-6 pt-3 sm:p-9 sm:pt-4 md:grid-cols-[1.3fr_.7fr]'>
          <div>
            <p className='eyebrow'>The story</p>
            <DialogDescription className='mt-3'>{movie.overview || 'TMDB does not currently have an overview for this film.'}</DialogDescription>
            <div className='mt-8 border-l border-primary/35 pl-5'><p className='eyebrow'>Why it fits</p><p className='mt-3 text-sm leading-7 text-white/75'>{movie.reason}</p></div>
          </div>
          <aside className='border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-7 md:pt-0'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-white/50'><Users className='size-4' aria-hidden='true' />Featured cast</div>
            <ul className='mt-4 space-y-3 text-sm text-white/80'>{movie.cast.map((person) => <li key={person}>{person}</li>)}</ul>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  )
}
