import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { enrichMoviesWithTmdb } from "../src/service/tmdb.service.js";
import type { Movie } from "../src/schemas/movie.schema.js";

const movie: Movie = {
    title: "Knives Out",
    year: 2019,
    genre: ["Mystery"],
    cast: ["Daniel Craig"],
    reason: "A sharp ensemble mystery.",
    rating: 7.9,
};

const originalToken = process.env.TMDB_API_READ_TOKEN;
const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
});

beforeEach(() => vi.restoreAllMocks());
afterEach(() => {
    if (originalToken === undefined) delete process.env.TMDB_API_READ_TOKEN;
    else process.env.TMDB_API_READ_TOKEN = originalToken;
});

describe("TMDB enrichment", () => {
    it("returns nullable metadata without a token and does not fetch", async () => {
        delete process.env.TMDB_API_READ_TOKEN;
        const fetchSpy = vi.spyOn(globalThis, "fetch");
        const [result] = await enrichMoviesWithTmdb([movie]);
        expect(fetchSpy).not.toHaveBeenCalled();
        expect(result).toMatchObject({ title: movie.title, tmdbId: null, posterUrl: null, trailerUrl: null });
    });

    it("selects an official YouTube trailer and builds image URLs", async () => {
        process.env.TMDB_API_READ_TOKEN = "test-token";
        vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(jsonResponse({ results: [{ id: 546554, title: "Knives Out", release_date: "2019-11-27", poster_path: "/poster.jpg", backdrop_path: "/backdrop.jpg", overview: "Overview", vote_average: 7.8, vote_count: 1234 }] }))
            .mockResolvedValueOnce(jsonResponse({ results: [
                { key: "unofficial", site: "YouTube", type: "Trailer", official: false },
                { key: "official", site: "YouTube", type: "Trailer", official: true },
            ] }));

        const [result] = await enrichMoviesWithTmdb([movie]);
        expect(result).toMatchObject({
            tmdbId: 546554,
            posterUrl: "https://image.tmdb.org/t/p/w500/poster.jpg",
            backdropUrl: "https://image.tmdb.org/t/p/w1280/backdrop.jpg",
            trailerKey: "official",
            trailerUrl: "https://www.youtube.com/watch?v=official",
        });
    });

    it("keeps movie metadata when the videos request fails", async () => {
        process.env.TMDB_API_READ_TOKEN = "test-token";
        vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(jsonResponse({ results: [{ id: 546554, title: "Knives Out", release_date: "2019-11-27", poster_path: "/poster.jpg", backdrop_path: null, overview: "Overview", vote_average: 7.8, vote_count: 1234 }] }))
            .mockResolvedValueOnce(jsonResponse({}, 503));

        const [result] = await enrichMoviesWithTmdb([movie]);
        expect(result).toMatchObject({ tmdbId: 546554, posterUrl: "https://image.tmdb.org/t/p/w500/poster.jpg", trailerKey: null, trailerUrl: null });
    });

    it("isolates a failed movie search", async () => {
        process.env.TMDB_API_READ_TOKEN = "test-token";
        vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("network down"));
        const [result] = await enrichMoviesWithTmdb([movie]);
        expect(result).toMatchObject({ title: movie.title, tmdbId: null, posterUrl: null });
    });
});
