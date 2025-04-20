#!/bin/bash

# Print current directory for debugging
echo "Current directory: $(pwd)"
echo "Listing files: $(ls -la)"

# Add Poetry bin to PATH
export PATH="/opt/render/project/poetry/bin:$PATH"

# Use Poetry to install dependencies from pyproject.toml
if [ -f "pyproject.toml" ]; then
  echo "Installing dependencies using Poetry"
  poetry install --no-dev
else
  # Fallback to pip if no pyproject.toml
  echo "Installing dependencies using pip"
  pip install --upgrade pip
  pip install -r requirements.txt
fi

# Print installed packages for debugging
echo "Installed packages:"
pip list