import { RepoInfo } from "src/internal/db/entities/repo_entity";
import { initExpressApp } from "../app";
import request from "supertest";
import { httpInternalServerError, httpOK } from "../response";

interface maxStars {
  name: string;
  url: string;
  stars: number;
}

interface apiResponse {
  message: string;
  data: any;
  error: Error | null;
  status: number;
}

const MaxStarsArr: maxStars[] = [
  {
    name: "test_name",
    url: "test_url",
    stars: 0,
  },
];

const repoInfoArr: RepoInfo[] = [
  {
    id: 1,
    name: "test_name",
    createdAt: "test_createdAt",
    updatedAt: "test_updatedAt",
    url: "test_url",
    description: "test_description",
    language: "test_language",
    forks: 0,
    stars: 0,
    openIssues: 0,
  },
];

const getReposWithMostStars = jest
  .fn()
  .mockReturnValueOnce(MaxStarsArr)
  .mockRejectedValueOnce(new Error("Error"))
  .mockReturnValueOnce({});

const getRepoByLanguage = jest
  .fn()
  .mockReturnValueOnce(repoInfoArr)
  .mockRejectedValueOnce(new Error("not found"))
  .mockReturnValueOnce({});

const app = initExpressApp(
  {
    saveCommits: jest.fn(),
    getCommitCountsByAuthor: jest.fn(),
    getCommits: jest.fn(),
    getDateOfLastCommit: jest.fn(),
  },
  {
    saveRepo: jest.fn(),
    getRepoByLanguage: getRepoByLanguage,
    getReposWithMostStars: getReposWithMostStars,
  },
);

describe("GET /repos/stars", () => {
  it("/repos/stars/1 returns status 200", async () => {
    const resBody: apiResponse = {
      message: "successful",
      data: MaxStarsArr,
      error: null,
      status: httpOK,
    };
    const res = await request(app).get("/repos/stars/1").send();
    expect(getReposWithMostStars.mock.calls).toHaveLength(1);
    expect(getReposWithMostStars.mock.results[0].value).toBe(MaxStarsArr);
    expect(res.statusCode).toBe(httpOK);
    expect(res.body).toEqual(resBody);
  });

  it("/repos/stars/1 returns status 500", async () => {
    const res = await request(app).get("/repos/stars/1").send();
    expect(getReposWithMostStars.mock.calls).toHaveLength(2);
    expect(res.statusCode).toBe(httpInternalServerError);
  });
});

describe("GET /repos/language", () => {
  it("/repos/language/go returns status 200", async () => {
    const res = await request(app).get("/repos/language/go").send();
    expect(getRepoByLanguage.mock.calls).toHaveLength(1);
    expect(getRepoByLanguage.mock.results[0].value).toBe(repoInfoArr);
    expect(res.statusCode).toBe(httpOK);
  });

  it("/repos/language/go returns status 500", async () => {
    const res = await request(app).get("/repos/language/go").send();
    expect(getRepoByLanguage.mock.calls).toHaveLength(2);
    expect(res.statusCode).toBe(httpInternalServerError);
  });
});
