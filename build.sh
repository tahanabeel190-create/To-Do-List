#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install Python dependencies
pip install -r backend/requirements.txt

# Install Node dependencies and build React app
cd frontend
npm install
npm run build
cd ..
