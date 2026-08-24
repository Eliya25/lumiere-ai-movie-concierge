import type { FormValues } from '@/App'
import type { RecommendationResponse } from '@/data/movies'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function requestRecommendations(input: FormValues): Promise<RecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  const body = await response.json().catch(() => null) as { error?: string } | RecommendationResponse | null
  if (!response.ok) {
    const message = body && 'error' in body ? body.error : undefined
    throw new ApiError(message || 'The concierge could not complete your request.', response.status)
  }

  return body as RecommendationResponse
}
