#!/bin/sh

docker kill api
docker rm api

docker run --name api \
	-p 8080:8080 \
	-v /sys/class/thermal/thermal_zone0/temp:/data/temp \
       	fredwilby/pi-api-server:latest
