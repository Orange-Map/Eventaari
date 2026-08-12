#!/bin/bash

source .env
 
curl -i -X POST "$VITE_API_URL/events" \
  -H "apikey: $VITE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "name": "test event",
    "description": "karhu karhu apua",
    "address": "Messikatu 13, Hämeenlinna",
    "starts_at": "2026-08-10T18:00",
    "lat": 61.0,
    "lng": 24.45
  }'
 

