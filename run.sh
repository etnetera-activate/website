#!/bin/bash

node ./scripts/build.js 2> /dev/null &
node ./live_server.js 