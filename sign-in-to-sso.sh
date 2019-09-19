#!/bin/bash

# conf
PORT="6778"

# code
SERVER_BASE="http://localhost:$PORT"
CURL_BASE=(curl -b /tmp/jar -c /tmp/jar)

node bin.js & p=$!
sleep 5s
LOC=$("${CURL_BASE[@]}" -v "$SERVER_BASE/auth/sso" 2>&1 | grep "location" | grep "https.*" -o)

kill "$p" -s SIGTERM

nc -l 6778 >/tmp/proto & p=$!
x-www-browser "$LOC"

sleep 5s

kill "$p"

