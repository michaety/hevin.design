#!/bin/bash
# local-validation.sh - Local file validation before deployment
# Tests the local build before pushing to production
# Usage: ./local-validation.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Print header
echo ""
echo "=============================================="
echo "🔍 LOCAL FILE VALIDATION"
echo "=============================================="
echo "Testing local files before deployment"
echo "Time: $(date)"
echo "=============================================="
echo ""

# Helper function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    printf "%-55s ... " "$test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Helper function for file existence
test_file_exists() {
    [ -f "$1" ]
}

# Helper function for file size check
test_file_size() {
    local file="$1"
    local min_size="${2:-1}"
    local max_size="${3:-999999999}"
    
    if [ -f "$file" ]; then
        local size=$(wc -c < "$file")
        [ $size -ge $min_size ] && [ $size -le $max_size ]
    else
        return 1
    fi
}

# Helper function to check content
test_file_contains() {
    local file="$1"
    local search_string="$2"
    grep -q "$search_string" "$file"
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 HTML FILE STRUCTURE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "index.html exists" "test_file_exists 'index.html'"
run_test "privacy.html exists" "test_file_exists 'privacy.html'"
run_test "terms.html exists" "test_file_exists 'terms.html'"
run_test "index.html is not empty (>10KB)" "test_file_size 'index.html' 10000"
run_test "index.html references styles.min.css" "test_file_contains 'index.html' 'styles.min.css'"
run_test "index.html references scripts.min.js" "test_file_contains 'index.html' 'scripts.min.js'"
run_test "index.html does NOT reference styles.css" "! test_file_contains 'index.html' 'href=\"styles.css\"'"
run_test "index.html does NOT reference scripts.js" "! test_file_contains 'index.html' 'src=\"scripts.js\"'"
run_test "privacy.html references styles.min.css" "test_file_contains 'privacy.html' 'styles.min.css'"
run_test "terms.html references styles.min.css" "test_file_contains 'terms.html' 'styles.min.css'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 CSS FILE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "styles.css exists (source)" "test_file_exists 'styles.css'"
run_test "styles.min.css exists (minified)" "test_file_exists 'styles.min.css'"
run_test "styles.css is not empty (>20KB)" "test_file_size 'styles.css' 20000"
run_test "styles.min.css is not empty (>15KB)" "test_file_size 'styles.min.css' 15000"
run_test "styles.min.css is smaller than styles.css" "[ \$(wc -c < styles.min.css) -lt \$(wc -c < styles.css) ]"
run_test "styles.min.css size is reasonable (<50KB)" "test_file_size 'styles.min.css' 1 51200"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚙️  JAVASCRIPT FILE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "scripts.js exists (source)" "test_file_exists 'scripts.js'"
run_test "scripts.min.js exists (minified)" "test_file_exists 'scripts.min.js'"
run_test "scripts.js is not empty (>15KB)" "test_file_size 'scripts.js' 15000"
run_test "scripts.min.js is not empty (>5KB)" "test_file_size 'scripts.min.js' 5000"
run_test "scripts.min.js is smaller than scripts.js" "[ \$(wc -c < scripts.min.js) -lt \$(wc -c < scripts.js) ]"
run_test "scripts.min.js size is reasonable (<20KB)" "test_file_size 'scripts.min.js' 1 20480"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🖼️  IMAGE & ASSET FILE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "logo.svg exists" "test_file_exists 'logo.svg'"
run_test "logo-transparent.svg exists" "test_file_exists 'logo-transparent.svg'"
run_test "favicon.ico exists" "test_file_exists 'favicon.ico'"
run_test "favicon.svg exists" "test_file_exists 'favicon.svg'"
run_test "favicon-192.png exists" "test_file_exists 'favicon-192.png'"
run_test "favicon-512.png exists" "test_file_exists 'favicon-512.png'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 ROBOTS & SITEMAP FILE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "robots.txt exists" "test_file_exists 'robots.txt'"
run_test "sitemap.xml exists" "test_file_exists 'sitemap.xml'"
run_test "site.webmanifest exists" "test_file_exists 'site.webmanifest'"
run_test "robots.txt contains User-agent" "test_file_contains 'robots.txt' 'User-agent'"
run_test "sitemap.xml contains urlset" "test_file_contains 'sitemap.xml' 'urlset'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 BUILD & CONFIGURATION FILE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "build.sh exists" "test_file_exists 'build.sh'"
run_test "build.sh is executable" "test -x 'build.sh'"
run_test "_headers file exists" "test_file_exists '_headers'"
run_test ".htaccess file exists" "test_file_exists '.htaccess'"
run_test "_headers contains Cache-Control" "test_file_contains '_headers' 'Cache-Control'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 DOCUMENTATION FILE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "PRODUCTION_DEPLOYMENT.md exists" "test_file_exists 'PRODUCTION_DEPLOYMENT.md'"
run_test "POST_MERGE_CHECKLIST.md exists" "test_file_exists 'POST_MERGE_CHECKLIST.md'"
run_test "CACHE_PURGE_INSTRUCTIONS.md exists" "test_file_exists 'CACHE_PURGE_INSTRUCTIONS.md'"
run_test "TEST_DEPLOYMENT_VALIDATION.md exists" "test_file_exists 'TEST_DEPLOYMENT_VALIDATION.md'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 GIT REPOSITORY TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test ".git directory exists" "test -d '.git'"
run_test ".gitignore exists" "test_file_exists '.gitignore'"
run_test "Working tree is clean" "git diff-index --quiet HEAD --"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 FILE SIZE SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v numfmt > /dev/null 2>&1; then
    echo "Source Files:"
    echo "  styles.css:     $(numfmt --to=iec $(wc -c < styles.css))"
    echo "  scripts.js:     $(numfmt --to=iec $(wc -c < scripts.js))"
    echo ""
    echo "Minified Files:"
    echo "  styles.min.css: $(numfmt --to=iec $(wc -c < styles.min.css))"
    echo "  scripts.min.js: $(numfmt --to=iec $(wc -c < scripts.min.js))"
    echo ""
    
    CSS_ORIG=$(wc -c < styles.css)
    CSS_MIN=$(wc -c < styles.min.css)
    JS_ORIG=$(wc -c < scripts.js)
    JS_MIN=$(wc -c < scripts.min.js)
    
    CSS_SAVINGS=$((CSS_ORIG - CSS_MIN))
    JS_SAVINGS=$((JS_ORIG - JS_MIN))
    CSS_PERCENT=$((CSS_SAVINGS * 100 / CSS_ORIG))
    JS_PERCENT=$((JS_SAVINGS * 100 / JS_ORIG))
    
    echo "Compression Ratio:"
    echo "  CSS:  $CSS_PERCENT% reduction ($(numfmt --to=iec $CSS_SAVINGS) saved)"
    echo "  JS:   $JS_PERCENT% reduction ($(numfmt --to=iec $JS_SAVINGS) saved)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

# Calculate pass rate
if [ $TOTAL_TESTS -gt 0 ]; then
    PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo "Pass Rate: $PASS_RATE%"
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}✅ ALL LOCAL VALIDATION TESTS PASSED!${NC}"
        echo ""
        echo "Ready for deployment. Next steps:"
        echo "  1. Commit changes: git add . && git commit -m 'Your message'"
        echo "  2. Push to GitHub: git push origin main"
        echo "  3. Wait for Cloudflare Pages deployment"
        echo "  4. Purge Cloudflare cache"
        echo "  5. Run remote validation: ./validate-deployment.sh https://hevin.design"
        exit 0
    else
        echo -e "${RED}❌ SOME TESTS FAILED!${NC}"
        echo "Please fix issues before deploying."
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  NO TESTS RUN${NC}"
    exit 1
fi

echo ""
echo "=============================================="
echo "Test completed: $(date)"
echo "=============================================="
echo ""
