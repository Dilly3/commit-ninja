## Overview

---

Commit-Ninja is API(REST) for monitoring and managing productivity. it retrieves information about repositories and its commits from GitHub API. The commits retirieved is use to analyze activities on a repository, eg. the contributor with the most commits and also repositories with the most stars.

The API is built with **_TypeScript_**, **_Docker_**,**_Redis_** and **_Postgres_**. The API retrieves repository and its commits from GitHub based on user settings and stores them in a Postgres database. The settings {repo owner , repo name, perPage count and since date } are persisted with Redis. At the start of the program this settings are set in the .env file. A sample of the.env file can be found in the sample.env.
An endpoint is exposed to update some of the settings fields like repoName, sinceDate(start fetching commits from this date).

## Operation

> A cron job runs at interval to check for and pulls commits from github api and updates the database with the data from github API.  
> Commit-Ninja API exposes endpoints to get the information about the repositories from the database.

## Requirement

1. Docker / Docker Desktop
2. Active Internet Connection

## Set up

1. Clone the repo from [github repo](https://github.com/Dilly3/commit-ninja)

2. Run

```yml
make compile # to compile
make install # to install dependencies
make up # to get the app running
make test # to run tests
```

## Project Structure

---

```yml
COMMIT-NINJA/
├── dist/
├── src/
  ├── __test__/
│ ├── cron/
│ ├── github/ # github api
│ ├── internal/
│ │ └── config/
	└── controller/
	└── db/
	└── dtos/
	└── error/
	└── paginator/
	└── redis/
	└── repository/
	└── server/
		└── handlers/
		└── logger/
		└── validator/
		└── app.ts
		└── response.ts
  └── index.ts
├── nodemon.json
├── Dockerfile
├── .env
├── docker-compose.yml
├── Makefile
├── package.json
├── tsconfig.json
└── README.md
```

## Endpoints

---

```js
1. POST /settings

```

### Request Body

```ts
	{
 "repo" :string ,
 "start_date" : string // "YYYY-MM-DD",
	}
```

### Response

```ts
{
  "message": "successful",
  "data": null,
  "status": 200
}
```

```js
2. GET /repos/language/:language // GO, JAVA etc
```

### Response

```ts
{
  "message": "successful",
  "data": [
	{
	  "id": number,
	  "name": string,
	  "url": string,
	  "description": string,
	  "language": string,
	  "forks": number,
	  "stars": number,
	  "openIssues": number
	}
  ],
  "status": 200
}

```

```js
3. GET /repos/stars/:limit
```

### Response

```ts
{
  "message": "successful",
  "data": [
	{
	  "name": string,
	  "url": string,
	  "stars": number
	},
	{
	  "name": string,
	  "url": string,
	  "stars": number
	}
  ],
  "status": 200
}
```

```js
4. GET /commits/stars/:limit
```

### Response

```ts
{
  "message": "successful",
  "data": [
	{
	  "author_email": string,
	  "author_name": string,
	  "repo_name": string,
	  "commit_count": number
	},
	{
	  "author_email": string,
	  "author_name": string,
	  "repo_name": string,
	  "commit_count": number
	},
  ],
  "status": 200
}
```

**_Error Responses_**

The API returns error details in JSON format:

```ts
{
  "message": string,
  "error": string,
  "status": 400
}
```

### Author Information

- **Name**: Olisa Michael
- **Email**: michael.anikamadu@gmail.com
- **Date**: 2024-12-30
