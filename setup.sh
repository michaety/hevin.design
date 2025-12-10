#!/bin/bash
# setup.sh - One-time setup for development environment
# Run this after cloning the repository

set -e

echo ""
echo "🚀 Setting up hevin.design development environment..."
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed"
    exit 1
fi

echo "✅ Git is installed"

# Check if build tools are available
echo ""
echo "Checking build dependencies..."

if command -v node &> /dev/null; then
    echo "✅ Node.js is installed ($(node --version))"
else
    echo "⚠️  Node.js is not installed"
    echo "   The build script uses npx which requires Node.js"
    echo "   Install from: https://nodejs.org/"
fi

if command -v npm &> /dev/null; then
    echo "✅ npm is installed ($(npm --version))"
else
    echo "⚠️  npm is not installed (comes with Node.js)"
fi

# Install pre-commit hook
echo ""
echo "📝 Installing pre-commit hook..."

if [ -f ".githooks/pre-commit" ]; then
    if git config core.hooksPath .githooks; then
        echo "✅ Pre-commit hook installed successfully"
        echo "   This will automatically run ./build.sh when you commit source files"
    else
        echo "❌ Failed to install pre-commit hook"
    fi
else
    echo "❌ Pre-commit hook file not found"
fi

# Make scripts executable
echo ""
echo "🔧 Making scripts executable..."

chmod +x build.sh 2>/dev/null && echo "✅ build.sh"
chmod +x local-validation.sh 2>/dev/null && echo "✅ local-validation.sh"
chmod +x validate-deployment.sh 2>/dev/null && echo "✅ validate-deployment.sh"
chmod +x .githooks/pre-commit 2>/dev/null && echo "✅ .githooks/pre-commit"

# Test build script
echo ""
echo "🧪 Testing build script..."
if ./build.sh &> /dev/null; then
    echo "✅ Build script works correctly"
else
    echo "⚠️  Build script test failed"
    echo "   Try running: ./build.sh"
    echo "   You may need to install clean-css-cli and terser"
fi

# Show git status
echo ""
echo "📊 Repository status:"
git status --short

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Quick start:"
echo "   1. Edit styles.css or scripts.js"
echo "   2. Run: ./build.sh"
echo "   3. Commit all files: git commit -am 'Update styles'"
echo "   4. Push: git push"
echo "   5. Purge Cloudflare cache (see QUICK_DEPLOYMENT_GUIDE.md)"
echo ""
echo "📖 Documentation:"
echo "   - QUICK_DEPLOYMENT_GUIDE.md - Quick reference"
echo "   - DEPLOYMENT_PROCESS_GUIDE.md - Complete guide"
echo "   - CACHE_PURGE_INSTRUCTIONS.md - Cache management"
echo ""
echo "🔗 Helpful commands:"
echo "   ./local-validation.sh           - Run 45 local tests"
echo "   ./validate-deployment.sh [URL]  - Test live deployment"
echo "   ./build.sh                      - Regenerate minified files"
echo ""
