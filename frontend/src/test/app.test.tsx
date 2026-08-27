import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'

const api = vi.hoisted(() => ({
  requestRecommendations: vi.fn(),
}))

vi.mock('@/api/recommendations', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/api/recommendations')>(),
  requestRecommendations: api.requestRecommendations,
}))

const movie = {
  title: 'Arrival',
  year: 2016,
  genre: ['Drama', 'Science Fiction'],
  cast: ['Amy Adams', 'Jeremy Renner'],
  reason: 'A thoughtful, atmospheric story with emotional depth and a sense of wonder.',
  rating: 7.9,
  tmdbId: 329865,
  posterUrl: null,
  backdropUrl: null,
  overview: 'A linguist works to understand visitors whose arrival could change humanity.',
  tmdbRating: 7.6,
  voteCount: 18_000,
  trailerKey: null,
  trailerUrl: null,
}

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  )
}

async function submitValidPrompt() {
  const user = userEvent.setup()
  await user.type(
    screen.getByLabelText('Describe the movie you want to watch'),
    'Something thoughtful and beautifully atmospheric',
  )
  await user.click(screen.getByRole('button', { name: 'Find my movies' }))
  return user
}

describe('movie concierge', () => {
  beforeEach(() => {
    api.requestRecommendations.mockReset()
  })

  it('validates the prompt before sending a request', async () => {
    renderApp()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Find my movies' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('at least 12 characters')
    expect(api.requestRecommendations).not.toHaveBeenCalled()
  })

  it('shows loading feedback and a recoverable API error', async () => {
    let rejectRequest: (error: Error) => void = () => undefined
    api.requestRecommendations.mockImplementation(() => new Promise((_resolve, reject) => {
      rejectRequest = reject
    }))
    renderApp()

    await submitValidPrompt()

    expect(screen.getByRole('button', { name: 'Curating…' })).toBeDisabled()
    await waitFor(() => {
      expect(screen.getByText('Reading the room…')).toBeVisible()
    })

    await act(async () => {
      rejectRequest(new Error('The recommendation service is temporarily unavailable.'))
    })

    expect(await screen.findByRole('heading', { name: 'The projector flickered' })).toBeVisible()
    expect(screen.getByText(/temporarily unavailable/)).toBeVisible()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled()
  })

  it('renders recommendations returned by the API', async () => {
    api.requestRecommendations.mockResolvedValue({ movies: [movie] })
    renderApp()

    await submitValidPrompt()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Selected for this moment' })).toBeVisible()
    })
    expect(screen.getByRole('button', { name: 'View details for Arrival' })).toBeVisible()
    expect(screen.getByText(movie.reason)).toBeVisible()
    expect(screen.getByText(/Amy Adams, Jeremy Renner/)).toBeVisible()
  })
})
