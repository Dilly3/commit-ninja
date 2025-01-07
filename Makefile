
build:
	@docker build --no-cache .

run:
	@docker run -p 7020:7020 -d commit-service