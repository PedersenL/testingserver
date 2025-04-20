#!/bin/bash

# Update pip
pip install --upgrade pip

# Install dependencies using pip
pip install -r requirements.txt

# Print installed packages for debugging
pip list