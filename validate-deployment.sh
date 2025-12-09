#!/bin/bash
# validate-deployment.sh - Automated deployment validation script
# Tests basic functionality of hevin.design deployment
# Usage: ./validate-deployment.sh [URL]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default URL (can be overridden with argument)
BASE_URL="${1:-https://hevin.design}"

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Print header
echo ""
echo "=============================================="
echo "🧪 DEPLOYMENT VALIDATION TEST SUITE"
echo "=============================================="
echo "Testing URL: $BASE_URL"
echo "Time: $(date)"
echo "=============================================="
echo ""

# Helper function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="${3:-0}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    printf "%-50s ... " "$test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        local result=$?
        if [ $result -eq $expected_result ]; then
            echo -e "${GREEN}✓ PASS${NC}"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            echo -e "${RED}✗ FAIL${NC}"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    else
        echo -e "${RED}✗ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Helper function for HTTP status tests
test_http_status() {
    local url="$1"
    local expected_status="${2:-200}"
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    [ "$status" -eq "$expected_status" ]
}

# Helper function to check if content exists
test_content_exists() {
    local url="$1"
    local search_string="$2"
    curl -s "$url" | grep -q "$search_string"
}

# Helper function to check resource size
test_resource_size() {
    local url="$1"
    local max_size="$2"
    local size=$(curl -s "$url" | wc -c)
    [ $size -gt 0 ] && [ $size -lt $max_size ]
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 HTML PAGE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "Homepage loads (200 OK)" "test_http_status '$BASE_URL/'"
run_test "Privacy page loads (200 OK)" "test_http_status '$BASE_URL/privacy.html'"
run_test "Terms page loads (200 OK)" "test_http_status '$BASE_URL/terms.html'"
run_test "Homepage contains title" "test_content_exists '$BASE_URL/' 'Hevin Design'"
run_test "Homepage contains hero section" "test_content_exists '$BASE_URL/' 'hero'"
run_test "Homepage contains services section" "test_content_exists '$BASE_URL/' 'services'"
run_test "Homepage contains portfolio section" "test_content_exists '$BASE_URL/' 'portfolio'"
run_test "Homepage contains pricing section" "test_content_exists '$BASE_URL/' 'pricing'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 CSS ASSET TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "Minified CSS loads (200 OK)" "test_http_status '$BASE_URL/styles.min.css'"
run_test "Minified CSS size < 50KB" "test_resource_size '$BASE_URL/styles.min.css' 51200"
run_test "Homepage references minified CSS" "test_content_exists '$BASE_URL/' 'styles.min.css'"
run_test "CSS contains color variables" "test_content_exists '$BASE_URL/styles.min.css' 'color-black'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚙️  JAVASCRIPT ASSET TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "Minified JS loads (200 OK)" "test_http_status '$BASE_URL/scripts.min.js'"
run_test "Minified JS size < 20KB" "test_resource_size '$BASE_URL/scripts.min.js' 20480"
run_test "Homepage references minified JS" "test_content_exists '$BASE_URL/' 'scripts.min.js'"
run_test "JS contains carousel code" "test_content_exists '$BASE_URL/scripts.min.js' 'carousel'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🖼️  IMAGE & ASSET TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "Logo SVG loads (200 OK)" "test_http_status '$BASE_URL/logo.svg'"
run_test "Logo transparent SVG loads" "test_http_status '$BASE_URL/logo-transparent.svg'"
run_test "Favicon ICO loads" "test_http_status '$BASE_URL/favicon.ico'"
run_test "Favicon SVG loads" "test_http_status '$BASE_URL/favicon.svg'"
run_test "Favicon PNG 192 loads" "test_http_status '$BASE_URL/favicon-192.png'"
run_test "Favicon PNG 512 loads" "test_http_status '$BASE_URL/favicon-512.png'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 ROBOTS & SITEMAP TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "robots.txt loads (200 OK)" "test_http_status '$BASE_URL/robots.txt'"
run_test "sitemap.xml loads (200 OK)" "test_http_status '$BASE_URL/sitemap.xml'"
run_test "robots.txt contains User-agent" "test_content_exists '$BASE_URL/robots.txt' 'User-agent'"
run_test "sitemap.xml is valid XML" "test_content_exists '$BASE_URL/sitemap.xml' 'urlset'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 SECURITY & META TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

run_test "Homepage has CSP meta tag" "test_content_exists '$BASE_URL/' 'Content-Security-Policy'"
run_test "Homepage has viewport meta" "test_content_exists '$BASE_URL/' 'viewport'"
run_test "Homepage has description meta" "test_content_exists '$BASE_URL/' 'meta name=\"description\"'"
run_test "Homepage has OG tags" "test_content_exists '$BASE_URL/' 'og:title'"
run_test "Manifest file loads" "test_http_status '$BASE_URL/site.webmanifest'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 RESOURCE OPTIMIZATION TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if cache headers are present
if command -v curl > /dev/null 2>&1; then
    printf "%-50s ... " "CSS has cache-control header"
    if curl -s -I "$BASE_URL/styles.min.css" | grep -qi "cache-control"; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${YELLOW}⚠ WARN${NC}"
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    printf "%-50s ... " "JS has cache-control header"
    if curl -s -I "$BASE_URL/scripts.min.js" | grep -qi "cache-control"; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${YELLOW}⚠ WARN${NC}"
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
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
        echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
        echo "Deployment validation successful."
        exit 0
    else
        echo -e "${RED}❌ SOME TESTS FAILED!${NC}"
        echo "Please review failed tests and fix issues."
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
