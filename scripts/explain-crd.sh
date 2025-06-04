#!/usr/bin/env bash
# Helper script to explore CRD schemas

set -euo pipefail

if [ $# -lt 1 ]; then
    echo "Usage: $0 <resource.field.path>"
    echo "Examples:"
    echo "  $0 dragonfly"
    echo "  $0 dragonfly.spec"
    echo "  $0 dragonfly.spec.resources"
    exit 1
fi

RESOURCE_PATH=$1

echo "📖 Explaining $RESOURCE_PATH..."
echo "================================"

kubectl explain "$RESOURCE_PATH" --recursive=false

echo -e "\n💡 To see all fields recursively, use:"
echo "kubectl explain $RESOURCE_PATH --recursive"

echo -e "\n🔍 To search for specific fields:"
echo "kubectl explain $RESOURCE_PATH --recursive | grep -i <field>"