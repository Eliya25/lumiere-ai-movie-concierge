import type { SelectHTMLAttributes } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { ArrowRight, ChevronDown, WandSparkles } from 'lucide-react'
import type { FormValues } from '@/App'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const prompts = ['A clever mystery for a rainy night','Something warm, nostalgic, and beautifully shot','A tense slow-burn thriller with a great ending','An underrated romantic drama that feels real']
const genres = ['Any genre','Drama','Thriller','Science fiction','Romance','Comedy','Crime','Horror']
const moods = ['Atmospheric','Comforting','Mind-bending','Adrenaline','Hopeful','Melancholic','Darkly funny']

type Props = { form: UseFormReturn<FormValues>; onSubmit: (values: FormValues) => void; onPromptSelect: (prompt: string) => void; isLoading: boolean }

export function ConciergeForm({ form, onSubmit, onPromptSelect, isLoading }: Props) {
  const prompt = form.watch('userPrompt')
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="composer" noValidate>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-primary"><WandSparkles className="size-4" aria-hidden="true" />What are you in the mood for?</div>
      <label htmlFor="userPrompt" className="sr-only">Describe the movie you want to watch</label>
      <Textarea id="userPrompt" maxLength={500} placeholder="A clever mystery for a rainy night, atmospheric but not too dark…" aria-invalid={Boolean(form.formState.errors.userPrompt)} aria-describedby="prompt-help prompt-error" {...form.register('userPrompt')} />
      <div className="flex min-h-5 items-center justify-between text-xs"><p id="prompt-error" role="alert" className="text-destructive">{form.formState.errors.userPrompt?.message}</p><span id="prompt-help" className="ml-auto tabular-nums text-muted-foreground">{prompt.length}/500</span></div>
      <div className="mt-1 flex flex-wrap gap-2" aria-label="Prompt suggestions">
        {prompts.map((item) => <button key={item} type="button" onClick={() => onPromptSelect(item)} className="prompt-chip">{item}</button>)}
      </div>
      <div className="mt-7 grid gap-3 border-t border-white/[.07] pt-6 sm:grid-cols-[1fr_1fr_.7fr_auto] sm:items-end">
        <SelectField label="Genre" options={genres} {...form.register('genre')} />
        <SelectField label="Mood" options={moods} {...form.register('mode')} />
        <SelectField label="Movies" options={['1','2','3','4','5','6']} {...form.register('count')} />
        <Button type="submit" size="lg" disabled={isLoading} className="mt-2 w-full sm:mt-0 sm:w-auto">{isLoading ? 'Curating…' : 'Find my movies'}<ArrowRight className="size-4" aria-hidden="true" /></Button>
      </div>
    </form>
  )
}

function SelectField({ label, options, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label:string; options:string[] }) {
  return <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">{label}</span><span className="relative block"><select className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/[.045] px-4 pr-10 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15" {...props}>{options.map((option) => <option key={option} value={option} className="bg-[#171315]">{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /></span></label>
}
