#!/bin/bash

kubectl --namespace=quiz create secret docker-registry gitlab-registry \
--docker-username=$DOCKER_USERNAME \
--docker-password=$DOCKER_PASSWORD \
--docker-email=$DOCKER_EMAIL \
--docker-server=$DOCKER_SERVER