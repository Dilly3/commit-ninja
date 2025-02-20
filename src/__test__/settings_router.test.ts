import { initExpressApp } from "../internal/server/router/app";
import request from "supertest";
import { httpBadRequest } from "../internal/server/response";

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

describe("POST /settings", () => {
  it("returns status 400, repo validation", async () => {
    const res = await request(app).post("/settings").send({
      repo: 2,
      start_date: "2023-12-30 ",
    });

    expect(res.statusCode).toBe(httpBadRequest);
    expect(res.body).toEqual({
      message: "repo must be a string",
      error: "bad request",
      status: httpBadRequest,
    });
  });

  it("returns status 400, date validation", async () => {
    const res = await request(app).post("/settings").send({
      repo: "houdini",
      start_date: "2023/12/30 ",
    });

    expect(res.statusCode).toBe(httpBadRequest);
    expect(res.body).toEqual({
      message: "start_date must be a valid date in YYYY-MM-DD format",
      error: "bad request",
      status: httpBadRequest,
    });
  });
});
