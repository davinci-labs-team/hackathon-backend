#!/bin/bash
set -e
source .env

if [ "${REFRESH_TOKEN1}" = "null" ]; then
  echo "❌ Refresh token not found:"
  exit 1
fi

# Refresh the token
echo "♻️ Refreshing token..."
refresh_response=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"${REFRESH_TOKEN1}\"}")

new_access_token=$(echo "$refresh_response" | jq -r '.access_token')

if [ "$new_access_token" = "null" ]; then
  echo "❌ Token refresh failed:"
  echo "$refresh_response"
  exit 1
fi

echo "✅ Token refreshed!"
echo "🔐 New Access Token 1: $new_access_token"
echo ""


if [ "${REFRESH_TOKEN2}" = "null" ]; then
  echo "❌ Refresh token not found:"
  exit 1
fi

# Refresh the token
echo "♻️ Refreshing token..."
refresh_response=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"${REFRESH_TOKEN2}\"}")

new_access_token=$(echo "$refresh_response" | jq -r '.access_token')

if [ "$new_access_token" = "null" ]; then
  echo "❌ Token refresh failed:"
  echo "$refresh_response"
  exit 1
fi

echo "✅ Token refreshed!"
echo "🔐 New Access Token 2: $new_access_token"