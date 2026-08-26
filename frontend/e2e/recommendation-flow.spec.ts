import { expect, test } from '@playwright/test'

const mockMovies = [
  {
    title: 'Prisoners',
    year: 2013,
    genre: ['Crime', 'Drama', 'Mystery'],
    cast: ['Hugh Jackman', 'Jake Gyllenhaal'],
    reason: 'A tense, rain-soaked mystery driven by difficult choices and patient suspense.',
    rating: 8.1,
    tmdbId: 146233,
    posterUrl: null,
    backdropUrl: null,
    overview: 'A desperate father takes matters into his own hands while a detective follows the case.',
    tmdbRating: 8.1,
    voteCount: 12_345,
    trailerKey: null,
    trailerUrl: null,
  },
  {
    title: 'The Conversation',
    year: 1974,
    genre: ['Drama', 'Mystery', 'Thriller'],
    cast: ['Gene Hackman', 'John Cazale'],
    reason: 'A cerebral slow-burn with an absorbing mystery and an atmosphere of quiet unease.',
    rating: 7.7,
    tmdbId: 592,
    posterUrl: null,
    backdropUrl: null,
    overview: 'A surveillance expert becomes consumed by the possibility that his work may lead to murder.',
    tmdbRating: 7.5,
    voteCount: 1_234,
    trailerKey: null,
    trailerUrl: null,
  },
]

test('submits a mood, renders recommendations, and opens movie details', async ({ page }) => {
  await page.route('**/api/recommend', async (route) => {
    expect(route.request().method()).toBe('POST')
    expect(route.request().postDataJSON()).toMatchObject({
      userPrompt: 'A clever mystery for a rainy night',
      genre: 'Any genre',
      mode: 'Comforting',
      count: 2,
    })

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ movies: mockMovies }),
    })
  })

  await page.goto('/')
  await page.getByLabel('Describe the movie you want to watch').fill('A clever mystery for a rainy night')
  await page.getByLabel('Mood').selectOption('Comforting')
  await page.getByLabel('Movies').selectOption('2')
  await page.getByRole('button', { name: 'Find my movies' }).click()

  await expect(page.getByRole('heading', { name: 'Selected for this moment' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'View details for Prisoners' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'View details for The Conversation' })).toBeVisible()

  await page.getByRole('button', { name: 'View details for Prisoners' }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Prisoners' })).toBeVisible()
  await expect(dialog.getByText('A desperate father takes matters into his own hands')).toBeVisible()
  await expect(dialog.getByText('Hugh Jackman')).toBeVisible()
})
