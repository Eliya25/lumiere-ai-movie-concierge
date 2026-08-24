export type Movie = {
  title: string
  year: number
  genre: string[]
  cast: string[]
  reason: string
  rating: number
  posterUrl?: string | null
  backdropUrl?: string | null
  overview?: string | null
  tmdbId?: number | null
  tmdbRating?: number | null
  voteCount?: number | null
}

export type RecommendationResponse = { movies: Movie[] }
