Commit-Ninja is a simple REST API for monitoring and managing productivity. it retrieves information about repositories and its commits from GitHub. The commits retirieved is use to analyze activities on a repository eg. the contributor with the most commits and also commits with the most stars.

The API is built with TypeScript, Docker,and Postgres. The API retrieves repository and its commits from GitHub based on user settings and stores them in a Postgres database. The settings {repo owner , repo name, perPage count and since date } are not persisted rather they are set in .env, A sample of the env is provided in .env-sample file.

The API also has a cron job that runs at interval to check for commits and update the data in the database.
