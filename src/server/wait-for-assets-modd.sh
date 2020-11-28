#!/bin/bash

curl frontend:8080/asset-manifest.json --retry 100 --retry-delay 2 --retry-connrefused --silent -o /dev/null
cd server
modd
