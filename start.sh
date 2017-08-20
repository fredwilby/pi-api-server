#!/bin/sh

docker kill api
docker rm api

docker run --name api -p 8080:8080 fredwilby/pi-api-server:latest
