#!/bin/bash

echo "Waiting for nginx..."
curl nginx --retry 100 --retry-delay 2 --retry-connrefused --silent -o /dev/null
echo "nginx looks ready!"
echo "Waiting for webpack-dev-server..."
curl frontend:8080/asset-manifest.json --retry 100 --retry-delay 2 --retry-connrefused --silent -o /dev/null
echo "webpack-dev-server looks ready!"
cd server
modd
