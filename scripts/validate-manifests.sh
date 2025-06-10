#!/usr/bin/env bash
# Validate Kubernetes manifests before committing
#
# This script validates YAML syntax and Kubernetes schema compliance for all
# manifests in the kubernetes/ directory. It handles Flux template variables
# by substituting them with safe placeholder values before validation.
#
# Supported template variables:
# - ${SECRET_DOMAIN} -> example.com
# - ${SECRET_DOMAIN/./-} -> example-com
# - ${DS_PROMETHEUS} -> prometheus-datasource

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Validating Kubernetes manifests..."

# Find all YAML files in kubernetes/ directory
MANIFESTS=$(find kubernetes/ -name "*.yaml" -o -name "*.yml" | grep -v ".sops.yaml")

ERRORS=0

# Function to check if file contains template variables
has_template_vars() {
    grep -q '\${[^}]*}' "$1" 2>/dev/null
}

# Function to substitute template variables with safe defaults
substitute_vars() {
    local file="$1"
    local temp_file="$2"
    
    # Perform substitutions for known template variables
    sed -e 's/${SECRET_DOMAIN}/example.com/g' \
        -e 's/${SECRET_DOMAIN\/.\/\-}/example-com/g' \
        -e 's/${DS_PROMETHEUS}/prometheus-datasource/g' \
        "$file" > "$temp_file"
}

for manifest in $MANIFESTS; do
    # Skip kustomization files and flux-specific files
    if [[ "$manifest" == *"kustomization.yaml"* ]] || [[ "$manifest" == *"/ks.yaml"* ]]; then
        continue
    fi

    # Check if it's a Kubernetes resource
    if ! grep -q "^kind:" "$manifest" 2>/dev/null; then
        continue
    fi

    echo -n "Checking $manifest... "

    # Try dry-run validation if kubectl is available
    if command -v kubectl &> /dev/null; then
        # Check if file contains template variables
        if has_template_vars "$manifest"; then
            # Create temp file with substituted variables
            temp_file=$(mktemp)
            substitute_vars "$manifest" "$temp_file"
            
            if kubectl apply --dry-run=client -f "$temp_file" &> /dev/null; then
                echo -e "${GREEN}✓${NC} (templated)"
            else
                echo -e "${RED}✗${NC} (templated)"
                echo -e "${RED}Error in $manifest:${NC}"
                kubectl apply --dry-run=client -f "$temp_file" 2>&1 | grep -E "error|Error"
                ((ERRORS++))
            fi
            
            # Clean up temp file
            rm -f "$temp_file"
        else
            # Regular validation for non-templated files
            if kubectl apply --dry-run=client -f "$manifest" &> /dev/null; then
                echo -e "${GREEN}✓${NC}"
            else
                echo -e "${RED}✗${NC}"
                echo -e "${RED}Error in $manifest:${NC}"
                kubectl apply --dry-run=client -f "$manifest" 2>&1 | grep -E "error|Error"
                ((ERRORS++))
            fi
        fi
    else
        echo -e "${YELLOW}⚠ kubectl not available, skipping validation${NC}"
    fi
done

# Check for CRD-specific validations
echo -e "\n🔍 Checking CRD-specific manifests..."

# Check Dragonfly manifests
DRAGONFLY_MANIFESTS=$(find kubernetes/ -name "*.yaml" | xargs grep -l "kind: Dragonfly" 2>/dev/null || true)
for manifest in $DRAGONFLY_MANIFESTS; do
    echo -n "Validating Dragonfly manifest $manifest... "

    # Check for common invalid fields
    if grep -q "spec:\s*redis:" "$manifest"; then
        echo -e "${RED}✗ Invalid field 'redis' found${NC}"
        ((ERRORS++))
    elif grep -q "spec:\s*storage:" "$manifest"; then
        echo -e "${RED}✗ Invalid field 'storage' found${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✓${NC}"
    fi
done

if [ $ERRORS -eq 0 ]; then
    echo -e "\n${GREEN}✅ All manifests validated successfully!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Found $ERRORS validation errors!${NC}"
    exit 1
fi