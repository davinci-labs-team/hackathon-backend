#!/bin/bash
set -e
source .env

# Configuration
EMAIL="testUtilisateurLocalLeo@gmail.com"
PASSWORD="super-secret-password"

# Sign up the user
echo "📨 Signing up user..."
signup_response=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/signup" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

# Extract access and refresh tokens
access_token=$(echo "$signup_response" | jq -r '.access_token')
refresh_token=$(echo "$signup_response" | jq -r '.refresh_token')

if [ "$access_token" = "null" ]; then
  echo "❌ Signup failed:"
  echo "$signup_response"
  exit 1
fi

echo "✅ Signup successful!"
echo "🔐 Access Token: $access_token"
echo "🔁 Refresh Token: $refresh_token"

