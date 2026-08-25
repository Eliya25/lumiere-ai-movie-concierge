import { Laugh, Moon, Rabbit, Sparkles, Sunrise } from 'lucide-react'

export type Refinement = { label: string; instruction: string }

const refinements = [
  { label: 'Darker', instruction: 'Make the selection darker and more psychologically intense.', icon: Moon },
  { label: 'More underrated', instruction: 'Prefer excellent lesser-known and underrated films.', icon: Sparkles },
  { label: 'Less intense', instruction: 'Make the selection gentler, calmer, and less intense.', icon: Sunrise },
  { label: 'Funnier', instruction: 'Add more wit, levity, and genuinely funny choices.', icon: Laugh },
  { label: 'More recent', instruction: 'Prefer strong recent releases from the last several years.', icon: Rabbit },
] satisfies Array<Refinement & { icon: typeof Moon }>

type Props = { activeLabel: string | null; disabled: boolean; onRefine: (refinement: Refinement) => void }

export function RefineControls({ activeLabel, disabled, onRefine }: Props) {
  return (
    <div className='mb-10 border-y border-white/[.07] py-5'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div><p className='eyebrow'>Tune the selection</p><p className='mt-1 text-sm text-muted-foreground'>Same evening, a slightly different direction.</p></div>
        <div className='flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:justify-end' aria-label='Refine recommendations'>
          {refinements.map(({ icon: Icon, ...refinement }) => {
            const active = refinement.label === activeLabel
            return <button key={refinement.label} type='button' disabled={disabled} aria-pressed={active} onClick={() => onRefine(refinement)} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45 ${active ? 'border-primary/50 bg-primary/15 text-primary' : 'border-white/10 bg-white/[.025] text-muted-foreground hover:border-primary/30 hover:text-foreground'}`}><Icon className='size-3.5' aria-hidden='true' />{refinement.label}</button>
          })}
        </div>
      </div>
    </div>
  )
}
