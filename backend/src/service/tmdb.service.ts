import type { Movie } from "../schemas/movie.schema.js";

const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

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

export type TmdbMovieData = {
    tmdbId: number | null;
    posterUrl: string | null;
    backdropUrl: string | null;
    overview: string | null;
    tmdbRating: number | null;
    voteCount: number | null;
};

const emptyTmdbData: TmdbMovieData = {
    tmdbId: null,
    posterUrl: null,
    backdropUrl: null,
    overview: null,
    tmdbRating: null,
    voteCount: null,
};

function imageUrl(path: string | null, size: "w500" | "w1280") {
    return path ? `${TMDB_IMAGE_URL}/${size}${path}` : null;
}

async function findMovie(movie: Movie): Promise<TmdbMovieData> {
    const token = process.env.TMDB_API_READ_TOKEN?.trim();
    if (!token) return emptyTmdbData;

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
        signal: AbortSignal.timeout(6_000),
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

    return {
        tmdbId: match.id,
        posterUrl: imageUrl(match.poster_path, "w500"),
        backdropUrl: imageUrl(match.backdrop_path, "w1280"),
        overview: match.overview || null,
        tmdbRating: match.vote_average || null,
        voteCount: match.vote_count || null,
    };
}

export async function enrichMoviesWithTmdb(movies: Movie[]) {
    const results = await Promise.allSettled(movies.map(findMovie));

    return movies.map((movie, index) => {
        const result = results[index];
        const tmdbData = result?.status === "fulfilled" ? result.value : emptyTmdbData;
        return { ...movie, ...tmdbData };
    });
}
