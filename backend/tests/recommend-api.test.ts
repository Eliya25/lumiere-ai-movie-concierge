import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import type { Express } from "express";

let app: Express;

beforeAll(async () => {
    process.env.GOOGLE_API_KEY ||= "test-key";
    ({ app } = await import("../src/app.js"));
});

describe("recommendation API validation", () => {
    it("returns health status", async () => {
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: "ok" });
    });

    it.each([0, 7, 1.5])("rejects invalid count %s", async (count) => {
        const response = await request(app).post("/api/recommend").send({
            userPrompt: "A thoughtful mystery for tonight",
            genre: "Mystery",
            mode: "Atmospheric",
            count,
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid request payload");
    });

    it("rejects missing and unknown fields", async () => {
        const response = await request(app).post("/api/recommend").send({
            userPrompt: "A thoughtful mystery for tonight",
            genre: "Mystery",
            count: 2,
            unexpected: true,
        });
        expect(response.status).toBe(400);
    });

    it("rejects oversized exclusion lists", async () => {
        const response = await request(app).post("/api/recommend").send({
            userPrompt: "A thoughtful mystery for tonight",
            genre: "Mystery",
            mode: "Atmospheric",
            count: 2,
            excludeTitles: Array.from({ length: 25 }, (_, index) => `Movie ${index}`),
        });
        expect(response.status).toBe(400);
    });
});
