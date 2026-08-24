import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Clapperboard, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Movie } from '@/data/movies'

export function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  const reduceMotion = useReducedMotion()
  const [imageFailed, setImageFailed] = useState(false)
  const rating = movie.tmdbRating ?? movie.rating
  return (
    <motion.article initial={reduceMotion ? false : { opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:index*.1 }} className="movie-card group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[1.15rem] bg-card">
        {movie.posterUrl && !imageFailed ? <img src={movie.posterUrl} alt={`${movie.title} poster`} onError={() => setImageFailed(true)} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" /> : <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_20%,#6e2639_0%,#24171b_42%,#0d0b0c_100%)] p-8 text-center"><div><Clapperboard className="mx-auto size-8 text-primary/75" aria-hidden="true" /><p className="mt-5 font-display text-3xl leading-tight text-white">{movie.title}</p><p className="mt-2 text-xs uppercase tracking-[.2em] text-white/45">Lumière selection</p></div></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap gap-2">{movie.genre.map((genre) => <Badge key={genre}>{genre}</Badge>)}</div>
          <div className="flex items-end justify-between gap-4">
            <div><h3 className="font-display text-2xl leading-tight text-white">{movie.title}</h3><p className="mt-1 text-sm text-white/65">{movie.year}</p></div>
            <div className="shrink-0 rounded-full bg-black/45 px-3 py-1.5 text-white backdrop-blur-md"><span className="flex items-center gap-1.5 text-sm font-semibold"><Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />{rating.toFixed(1)}</span>{movie.voteCount ? <span className="mt-0.5 block text-center text-[9px] text-white/50">{movie.voteCount.toLocaleString()} votes</span> : null}</div>
          </div>
        </div>
      </div>
      <div className="px-1 pb-2 pt-5"><p className="eyebrow">Why it fits</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{movie.reason}</p><p className="mt-4 text-xs text-muted-foreground/70"><span className="text-foreground/80">Starring</span> · {movie.cast.join(', ')}</p></div>
    </motion.article>
  )
}
