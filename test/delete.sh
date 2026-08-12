#!/bin/bash

source .env

# the id of the event to delete 
ID=$1

if [ -z "$ID" ]; then
  echo "put an event id. example: ./test/delete-event.sh 4"
  exit 1
fi

curl -i -X DELETE "$VITE_API_URL/events?id=eq.$ID" \
  -H "apikey: $VITE_ANON_KEY"
