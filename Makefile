##
## EPITECH PROJECT, 2023
## AREA
## File description:
## Makefile
##

VERSION		= 1.0.0
PLATFORMS	= "linux/amd64,linux/arm/v7,linux/arm64/v8,linux/ppc64le"

all: build

build:
	docker compose build

run:
	docker compose up

clean:
	docker compose down
	docker compose rm -f
	docker volume prune -f
	docker network prune -f

push:
	docker buildx build --platform ${PLATFORMS} --push -t lqvrent/area-server:${VERSION} area-api
	docker buildx build --platform ${PLATFORMS} --push -t lqvrent/area-client-mobile:${VERSION} area-mobile
	docker buildx build --platform ${PLATFORMS} --push -t lqvrent/area-client-web:${VERSION} area-web

.PHONY: all build run clean

server:
	sudo docker compose down
	sudo docker compose build serverr
	sudo docker compose up

client:
	sudo docker compose down
	sudo docker compose build client_webb
	sudo docker compose up