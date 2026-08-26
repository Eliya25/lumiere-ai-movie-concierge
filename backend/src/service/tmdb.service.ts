import type { Movie } from "../schemas/movie.schema.js";
import { TtlCache } from "../lib/ttl-cache.js";
import { runtimeConfig } from "../config/runtime.js";

const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";
const tmdbCache = new TtlCache<string, TmdbMovieData>(runtimeConfig.tmdbCacheTtlMs, runtimeConfig.cacheMaxEntries);

type TmdbSearchResult = {
    id: number;
    title: string;
    release_date?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    vote_average: number;
    vote_count: number;
};

type TmdbSearchResponse = {
    results: TmdbSearchResult[];
};

type TmdbVideo = {
    key: string;
    site: string;
    type: string;
    official: boolean;
};

type TmdbVideosResponse = { results: TmdbVideo[] };

export type TmdbMovieData = {
    tmdbId: number | null;
    posterUrl: string | null;
    backdropUrl: string | null;
    overview: string | null;
    tmdbRating: number | null;
    voteCount: number | null;
    trailerKey: string | null;
    trailerUrl: string | null;
};

const emptyTmdbData: TmdbMovieData = {
    tmdbId: null,
    posterUrl: null,
    backdropUrl: null,
    overview: null,
    tmdbRating: null,
    voteCount: null,
    trailerKey: null,
    trailerUrl: null,
};

function imageUrl(path: string | null, size: "w500" | "w1280") {
    return path ? `${TMDB_IMAGE_URL}/${size}${path}` : null;
}

async function findTrailer(tmdbId: number, token: string) {
    const response = await fetch(`${TMDB_API_URL}/movie/${tmdbId}/videos?language=en-US`, {
        headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
        signal: AbortSignal.timeout(runtimeConfig.tmdbRequestTimeoutMs),
    });
    if (!response.ok) throw new Error(`TMDB videos failed with status ${response.status}`);

    const data = await response.json() as TmdbVideosResponse;
    const youtube = data.results.filter((video) => video.site === "YouTube");
    const video =
        youtube.find((item) => item.type === "Trailer" && item.official) ??
        youtube.find((item) => item.type === "Trailer") ??
        youtube.find((item) => item.type === "Teaser" && item.official) ??
        youtube.find((item) => item.type === "Teaser");

    return video ? { trailerKey: video.key, trailerUrl: `https://www.youtube.com/watch?v=${video.key}` } : null;
}

async function findMovie(movie: Movie): Promise<TmdbMovieData> {
    const token = process.env.TMDB_API_READ_TOKEN?.trim();
    if (!token) return emptyTmdbData;
    const cacheKey = `${movie.title.trim().toLocaleLowerCase("en-US")}|${movie.year}`;
    const cached = tmdbCache.get(cacheKey);
    if (cached) return cached;

    const params = new URLSearchParams({
        query: movie.title,
        primary_release_year: String(movie.year),
        include_adult: "false",
        language: "en-US",
    });

    const response = await fetch(`${TMDB_API_URL}/search/movie?${params}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
        },
        signal: AbortSignal.timeout(runtimeConfig.tmdbRequestTimeoutMs),
    });

    if (!response.ok) {
        throw new Error(`TMDB search failed with status ${response.status}`);
    }

    const data = await response.json() as TmdbSearchResponse;
    const exactYearMatch = data.results.find((result) =>
        result.release_date?.startsWith(String(movie.year)),
    );
    const match = exactYearMatch ?? data.results[0];
    if (!match) return emptyTmdbData;
    const trailer = await findTrailer(match.id, token).catch(() => null);

    const enrichedMovie = {
        tmdbId: match.id,
        posterUrl: imageUrl(match.poster_path, "w500"),
        backdropUrl: imageUrl(match.backdrop_path, "w1280"),
        overview: match.overview || null,
        tmdbRating: match.vote_average || null,
        voteCount: match.vote_count || null,
        trailerKey: trailer?.trailerKey ?? null,
        trailerUrl: trailer?.trailerUrl ?? null,
    };
    tmdbCache.set(cacheKey, enrichedMovie);
    return enrichedMovie;
}

export function clearTmdbCache() {
    tmdbCache.clear();
}

export async function enrichMoviesWithTmdb(movies: Movie[]) {
    const results = await Promise.allSettled(movies.map(findMovie));

    return movies.map((movie, index) => {
        const result = results[index];
        const tmdbData = result?.status === "fulfilled" ? result.value : emptyTmdbData;
        return { ...movie, ...tmdbData };
    });
}
