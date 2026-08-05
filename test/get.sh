#!/bin/bash

source .env

curl "$VITE_API_URL/events" \
  -H "apikey: $VITE_ANON_KEY"


