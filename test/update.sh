#!/bin/bash

source .env

# the id of the event to update
ID=$1

if [ -z "$ID" ]; then
  echo "put an event id. example: ./test/update-event.sh 4"
  exit 1
fi

curl -i -X PATCH "$VITE_API_URL/events?id=eq.$ID" \
  -H "apikey: $VITE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"name": "Test Event (edited)"}'


