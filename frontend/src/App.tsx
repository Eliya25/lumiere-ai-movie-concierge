import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { z } from 'zod'
import { Film, RotateCcw, Sparkles, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConciergeForm } from '@/components/concierge-form'
import { MovieCard } from '@/components/movie-card'
import { MovieSkeleton } from '@/components/movie-skeleton'
import { requestRecommendations } from '@/api/recommendations'

const formSchema = z.object({
  userPrompt: z.string().trim().min(12, 'Give us a little more detail (at least 12 characters).').max(500),
  genre: z.string(), mode: z.string(), count: z.coerce.number().int().min(1).max(6),
})
export type FormValues = z.infer<typeof formSchema>
const defaultValues: FormValues = { userPrompt:'', genre:'Any genre', mode:'Atmospheric', count:3 }

export default function App() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null)
  const reduceMotion = useReducedMotion()
  const form = useForm<FormValues>({ resolver:zodResolver(formSchema), defaultValues })
  const recommendation = useMutation({ mutationFn: requestRecommendations })
  const movies = recommendation.data?.movies ?? []

  const submit = (values: FormValues) => {
    setSubmitted(values)
    recommendation.mutate(values)
  }
  const choosePrompt = (prompt:string) => {
    form.setValue('userPrompt',prompt,{ shouldValidate:true, shouldDirty:true })
    document.querySelector<HTMLTextAreaElement>('#userPrompt')?.focus()
  }

  return <div className="min-h-screen overflow-hidden bg-background text-foreground">
    <div className="ambient ambient-one" aria-hidden="true" /><div className="ambient ambient-two" aria-hidden="true" />
    <header className="relative z-20 border-b border-white/[.06]"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
      <a href="#top" className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-9 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary"><Film className="size-4" aria-hidden="true" /></span><span className="font-display text-xl tracking-[.08em]">LUMIÈRE</span></a>
      <span className="hidden text-[11px] font-semibold uppercase tracking-[.24em] text-muted-foreground sm:block">AI Movie Concierge</span>
    </div></header>
    <main id="top" className="relative z-10">
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-24 sm:pt-24 lg:pt-28">
        <motion.div initial={reduceMotion ? false : { opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ duration:.7 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[.07] px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-primary"><Sparkles className="size-3.5" aria-hidden="true" />Personal cinema, thoughtfully curated</div>
          <h1 className="mx-auto max-w-4xl text-balance font-display text-5xl leading-[.98] tracking-[-.035em] sm:text-7xl lg:text-[5.6rem]">Your next favorite film is <span className="text-gradient">waiting.</span></h1>
          <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-7 text-muted-foreground sm:text-lg">Describe the feeling, the setting, or the story you crave. We’ll curate a watchlist that feels made for this exact moment.</p>
        </motion.div>
        <motion.div className="mt-11 text-left sm:mt-14" initial={reduceMotion ? false : { opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ duration:.7,delay:.12 }}><ConciergeForm form={form} onSubmit={submit} onPromptSelect={choosePrompt} isLoading={recommendation.isPending} /></motion.div>
      </section>
      <AnimatePresence mode="wait">
        {!submitted ? <motion.section key="idle" exit={{ opacity:0 }} className="border-y border-white/[.05] bg-white/[.015]"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8 lg:px-12">
          {[['01','Set the scene','Tell us what kind of evening, feeling, or story you have in mind.'],['02','We read between the lines','Mood, genre, and nuance shape a shortlist—not just an algorithm.'],['03','Press play','Discover films chosen with context, plus a reason each one belongs.']].map(([number,title,copy]) => <div key={number} className="border-l border-primary/20 pl-5"><span className="text-xs font-bold tracking-[.2em] text-primary">{number}</span><h2 className="mt-3 font-display text-xl">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div>)}
        </div></motion.section> : <motion.section key="results" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }} className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12" aria-live="polite" aria-busy={recommendation.isPending}>
          <div className="mb-9 flex flex-col gap-5 border-t border-white/[.07] pt-10 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Your private screening</p><h2 className="mt-2 font-display text-3xl sm:text-4xl">{recommendation.isPending ? 'Curating your watchlist…' : recommendation.isError ? 'The projector flickered' : 'Selected for this moment'}</h2><p className="mt-3 max-w-2xl truncate text-sm text-muted-foreground">“{submitted.userPrompt}”</p></div>{recommendation.isSuccess ? <Button variant="outline" onClick={() => recommendation.mutate(submitted)}><RotateCcw className="size-4" aria-hidden="true" />Regenerate</Button> : null}</div>
          {recommendation.isPending ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length:submitted.count },(_,index)=><MovieSkeleton key={index} />)}</div> : recommendation.isError ? <div className="rounded-3xl border border-destructive/20 bg-destructive/[.05] px-6 py-14 text-center"><TriangleAlert className="mx-auto size-8 text-destructive" aria-hidden="true" /><h3 className="mt-5 font-display text-2xl">We couldn’t complete this screening.</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{recommendation.error.message} Check that the concierge service is running, then try once more.</p><Button className="mt-6" onClick={() => recommendation.mutate(submitted)}>Try again</Button></div> : movies.length === 0 ? <div className="rounded-3xl border border-white/10 bg-white/[.025] px-6 py-14 text-center"><Film className="mx-auto size-8 text-primary" aria-hidden="true" /><h3 className="mt-5 font-display text-2xl">No films made the final cut.</h3><p className="mt-2 text-sm text-muted-foreground">Try broadening the mood or genre and let us curate again.</p></div> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{movies.map((movie,index)=><MovieCard key={`${movie.title}-${movie.year}`} movie={movie} index={index} />)}</div>}
        </motion.section>}
      </AnimatePresence>
    </main>
    <footer className="relative z-10 border-t border-white/[.06]"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 text-xs text-muted-foreground sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12"><div><p className="font-display text-base tracking-wide text-foreground">LUMIÈRE</p><p className="mt-1">Crafted with Gemini, LangChain &amp; TMDB.</p></div><div className="max-w-xl lg:text-right"><span className="font-bold tracking-[.16em] text-[#01b4e4]">TMDB</span><p className="mt-1">This product uses the TMDB API but is not endorsed or certified by TMDB.</p></div></div></footer>
  </div>
}
