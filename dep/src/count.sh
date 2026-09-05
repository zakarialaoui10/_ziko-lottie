#!/bin/bash

# Count total lines in all .js and .ts files, excluding dist and node_modules
total_lines=$(find . -type f \( -name "*.js" -o -name "*.ts" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" \
  -exec wc -l {} + | awk '{total += $1} END {print total}')

echo "Total JS + TS lines: $total_lines"
