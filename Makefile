
up: install compile
	@docker compose up --build

install:
	@npm install

compile:
	@tsc
PHONY: build run compile install