import { describe, expect, it } from "vitest";
import { TtlCache } from "../src/lib/ttl-cache.js";

describe("TtlCache", () => {
    it("returns entries until their TTL expires", () => {
        let now = 1_000;
        const cache = new TtlCache<string, number>(100, 10, () => now);
        cache.set("answer", 42);
        expect(cache.get("answer")).toBe(42);
        now = 1_100;
        expect(cache.get("answer")).toBeUndefined();
    });

    it("evicts the oldest entry at capacity", () => {
        const cache = new TtlCache<string, number>(1_000, 2, () => 0);
        cache.set("first", 1);
        cache.set("second", 2);
        cache.set("third", 3);
        expect(cache.get("first")).toBeUndefined();
        expect(cache.get("second")).toBe(2);
        expect(cache.get("third")).toBe(3);
    });

    it("refreshes an existing key without growing past capacity", () => {
        const cache = new TtlCache<string, number>(1_000, 2, () => 0);
        cache.set("first", 1);
        cache.set("second", 2);
        cache.set("first", 10);
        expect(cache.get("first")).toBe(10);
        expect(cache.get("second")).toBe(2);
    });
});
