#!bin/bash
# Script to set up Python environment for matchmaking

set -e

# Check if Python 3.9+ is installed
if [ ! -d "venv" ]; then
  echo "📦 Virtual environment in progress..."
  python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "⬇️ Install Python dependencies..."
pip install --upgrade pip
pip install -r python/requirements.txt

echo "✅ Python environment setup complete."