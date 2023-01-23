#!/bin/bash

node ./scripts/build 2> /dev/null &
node ./live-server.js 