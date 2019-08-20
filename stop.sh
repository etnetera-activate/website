#!/bin/bash

pid=$(ps ax | grep node | grep build | cut -f 2 -d " ")
echo "Kiling $pid"
kill $pid

