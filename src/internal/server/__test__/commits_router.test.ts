import { initExpressApp } from "../app";
import request from "supertest";
import { httpInternalServerError, httpOK, apiResponse } from "../response";

interface CommitSumm {
  author_email: string;
  author_name: string;
  commit_count: number;
  repo_name: string;
}
const commitSumArr: CommitSumm[] = [
  {
    author_email: "test_email@test.com",
    author_name: "test_name",
    commit_count: 0,
    repo_name: "test_repo",
  },
];

const getCommitCountsByAuthor = jest
  .fn()
  .mockReturnValueOnce(commitSumArr)
  .mockRejectedValueOnce(new Error("Error"))
  .mockReturnValueOnce({});

const app = initExpressApp(
  {
    saveCommits: jest.fn(),
    getCommitCountsByAuthor,
    getCommits: jest.fn(),
    getDateOfLastCommit: jest.fn(),
  },
  {
    saveRepo: jest.fn(),
    getRepoByLanguage: jest.fn(),
    getReposWithMostStars: jest.fn(),
  },
);

describe("GET /count", () => {
  it("returns status 200", async () => {
    const resBody: apiResponse = {
      message: "successful",
      data: commitSumArr,
      status: httpOK,
    };
    const res = await request(app).get("/commits/count").send();
    expect(getCommitCountsByAuthor.mock.calls).toHaveLength(1);
    expect(getCommitCountsByAuthor.mock.results[0].value).toBe(commitSumArr);
    expect(res.statusCode).toBe(httpOK);
    expect(res.body).toEqual(resBody);
  });

  it("returns status 500", async () => {
    const res = await request(app).get("/commits/count").send();
    expect(getCommitCountsByAuthor.mock.calls).toHaveLength(2);
    expect(res.statusCode).toBe(httpInternalServerError);
  });
});
