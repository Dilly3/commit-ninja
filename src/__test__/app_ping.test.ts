import { describe } from "node:test";
import { initExpressApp } from "../internal/server/router/app";
import request from "supertest";
import { httpOK } from "../internal/server/response";

const app = initExpressApp(
  {
    saveCommits: jest.fn(),
    getCommitCountsByAuthor: jest.fn(),
    getCommits: jest.fn(),
    getDateOfLastCommit: jest.fn(),
  },
  {
    saveRepo: jest.fn(),
    getRepoByLanguage: jest.fn(),
    getReposWithMostStars: jest.fn(),
  },
);

describe("GET /ping", () => {
  it("returns status 200", async () => {
    const res = await request(app).get("/ping").send();

    expect(res.statusCode).toBe(httpOK);
    expect(res.body).toBe("pong!!");
  });
});
