#!/bin/bash
set -e
source .env

# Configuration
EMAIL="test-organizer@example.com"
PASSWORD="password123"

# Log in the user
echo "📨 Logging in user..."
login_response=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

# Extract access and refresh tokens
access_token=$(echo "$login_response" | jq -r '.access_token')
refresh_token=$(echo "$login_response" | jq -r '.refresh_token')

if [ "$access_token" = "null" ]; then
  echo "❌ Login failed:"
  echo "$login_response"
  exit 1
fi

echo "✅ Login successful!"
echo "🔐 Access Token: $access_token"
echo "🔁 Refresh Token: $refresh_token"
