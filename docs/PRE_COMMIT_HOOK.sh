#!/bin/bash
#
# Git Pre-Commit Hook - Bundle Size Check
#
# INSTALLATION:
# 1. Copy this file: cp docs/PRE_COMMIT_HOOK.sh .git/hooks/pre-commit
# 2. Make executable: chmod +x .git/hooks/pre-commit
# 3. Test it: git commit (should run checks before committing)
#
# This hook prevents commits that:
# - Add banned dependencies
# - Increase bundle size beyond limits
# - Break the build
#

set -e

echo "🔍 Running pre-commit checks..."

# Check if package.json was modified
if git diff --cached --name-only | grep -q "package.json"; then
  echo "📦 package.json modified, checking for banned dependencies..."

  cd frontend
  pnpm run check-deps

  if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Commit rejected: Banned dependency detected!"
    echo "   See /frontend/docs/DEPENDENCIES.md for alternatives"
    exit 1
  fi

  cd ..
fi

# Check if any TypeScript/TSX files were modified
if git diff --cached --name-only | grep -qE '\.(ts|tsx)$'; then
  echo "📝 TypeScript files modified, running type check..."

  cd frontend
  pnpm run build > /dev/null 2>&1

  if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Commit rejected: Build failed!"
    echo "   Run 'pnpm run build' to see errors"
    exit 1
  fi

  cd ..
fi

echo "✅ Pre-commit checks passed!"
exit 0
