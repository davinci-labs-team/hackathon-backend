#!bin/bash
# Script to set up Python environment for matchmaking

set -e

# Check if Python 3.12+ is installed
if ! command -v python3 &> /dev/null || [[ "$(python3 -c 'import sys; print(sys.version_info[:][0])')" -lt 3 || ("$(python3 -c 'import sys; print(sys.version_info[:][0])')" -eq 3 && "$(python3 -c 'import sys; print(sys.version_info[:][1])')" -lt 12) ]]; then
  echo "❌ Python 3.12 or higher is required. Please install it and try again."
  exit 1
fi
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