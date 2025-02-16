
up: install
	@docker compose up --build
test:
	@npm run test

install:
	@npm install

compile:
	@tsc

PHONY: build run compile install