#!/bin/bash

# conf
PORT="6778"

# code
SERVER_BASE="http://localhost:$PORT"
CURL_BASE=(curl -b /tmp/jar -c /tmp/jar)

node bin.js & p=$!
sleep 3s
LOC=$("${CURL_BASE[@]}" -v "$SERVER_BASE/auth/sso" 2>&1 | grep "location" | grep "https.*" -o)

kill -s SIGTERM "$p"
sleep 1s

nc -l 6778 >/tmp/proto & p=$!
x-www-browser "$LOC"

sleep 2s

kill "$p"

node bin.js & p=$!
sleep 2s

URL=$(cat /tmp/proto | grep "/auth" | grep -o "/auth[a-z0-9/?=&A-Z-]*")

"${CURL_BASE[@]}" -v "$SERVER_BASE$URL"

while true; do
  read -p ">" "params"
  "${CURL_BASE[@]}" -v "$SERVER_BASE"$params
done
