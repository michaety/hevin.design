#!/bin/bash
# build.sh - Regenerate minified files for production deployment
# Usage: ./build.sh

set -e  # Exit on error

echo "🔨 Building production assets..."
echo ""

# Check if source files exist
if [ ! -f "styles.css" ]; then
    echo "❌ Error: styles.css not found"
    exit 1
fi

if [ ! -f "scripts.js" ]; then
    echo "❌ Error: scripts.js not found"
    exit 1
fi

# Get file sizes before
STYLES_SIZE_BEFORE=$(wc -c < styles.css)
SCRIPTS_SIZE_BEFORE=$(wc -c < scripts.js)

echo "📦 Minifying CSS..."
npx clean-css-cli -o styles.min.css styles.css

echo "📦 Minifying JavaScript..."
npx terser scripts.js -o scripts.min.js -c -m

# Get file sizes after
STYLES_MIN_SIZE=$(wc -c < styles.min.css)
SCRIPTS_MIN_SIZE=$(wc -c < scripts.min.js)

# Calculate savings
STYLES_SAVED=$((STYLES_SIZE_BEFORE - STYLES_MIN_SIZE))
SCRIPTS_SAVED=$((SCRIPTS_SIZE_BEFORE - SCRIPTS_MIN_SIZE))
STYLES_PERCENT=$((STYLES_SAVED * 100 / STYLES_SIZE_BEFORE))
SCRIPTS_PERCENT=$((SCRIPTS_SAVED * 100 / SCRIPTS_SIZE_BEFORE))

echo ""
echo "✅ Build complete!"
echo ""
echo "📊 Size comparison:"
echo "   CSS:        $(numfmt --to=iec $STYLES_SIZE_BEFORE) → $(numfmt --to=iec $STYLES_MIN_SIZE) (${STYLES_PERCENT}% reduction)"
echo "   JavaScript: $(numfmt --to=iec $SCRIPTS_SIZE_BEFORE) → $(numfmt --to=iec $SCRIPTS_MIN_SIZE) (${SCRIPTS_PERCENT}% reduction)"
echo ""
echo "📝 Next steps:"
echo "   1. Commit the updated minified files"
echo "   2. Deploy to production"
echo "   3. Purge Cloudflare cache"
echo ""
