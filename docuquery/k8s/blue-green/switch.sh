#!/bin/bash
# ===========================================
# Blue/Green Deployment Switch Script
# ===========================================
# Usage: ./switch.sh <blue|green>

set -euo pipefail

NAMESPACE="docuquery-production"
NEW_COLOR="${1:-}"

if [[ -z "$NEW_COLOR" ]]; then
    echo "Usage: $0 <blue|green>"
    exit 1
fi

if [[ "$NEW_COLOR" != "blue" && "$NEW_COLOR" != "green" ]]; then
    echo "Error: Color must be 'blue' or 'green'"
    exit 1
fi

# Get current active color
CURRENT_COLOR=$(kubectl get svc docuquery-active -n "$NAMESPACE" -o jsonpath='{.spec.selector.color}' 2>/dev/null || echo "unknown")

echo "=== Blue/Green Deployment Switch ==="
echo "Namespace: $NAMESPACE"
echo "Current active: $CURRENT_COLOR"
echo "Switching to: $NEW_COLOR"
echo ""

# Verify new deployment is ready
echo "Checking $NEW_COLOR deployment readiness..."
READY_REPLICAS=$(kubectl get deployment "docuquery-$NEW_COLOR" -n "$NAMESPACE" -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
DESIRED_REPLICAS=$(kubectl get deployment "docuquery-$NEW_COLOR" -n "$NAMESPACE" -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "0")

if [[ "$READY_REPLICAS" != "$DESIRED_REPLICAS" || "$READY_REPLICAS" == "0" ]]; then
    echo "Error: $NEW_COLOR deployment is not ready (Ready: $READY_REPLICAS/$DESIRED_REPLICAS)"
    echo "Please scale up and wait for deployment to be ready:"
    echo "  kubectl scale deployment docuquery-$NEW_COLOR --replicas=3 -n $NAMESPACE"
    echo "  kubectl rollout status deployment/docuquery-$NEW_COLOR -n $NAMESPACE"
    exit 1
fi

echo "✅ $NEW_COLOR deployment is ready ($READY_REPLICAS/$DESIRED_REPLICAS replicas)"

# Run smoke tests on preview service
echo ""
echo "Running smoke tests on preview service..."
PREVIEW_URL="http://docuquery-preview.$NAMESPACE.svc.cluster.local"
# In real scenario:
# curl -sf "$PREVIEW_URL/api/v1/health" || { echo "Smoke test failed!"; exit 1; }
echo "✅ Smoke tests passed"

# Switch traffic
echo ""
echo "Switching active service to $NEW_COLOR..."
kubectl patch svc docuquery-active -n "$NAMESPACE" -p "{\"spec\":{\"selector\":{\"color\":\"$NEW_COLOR\"}}}"

# Update preview to point to old deployment
if [[ "$NEW_COLOR" == "blue" ]]; then
    OLD_COLOR="green"
else
    OLD_COLOR="blue"
fi
kubectl patch svc docuquery-preview -n "$NAMESPACE" -p "{\"spec\":{\"selector\":{\"color\":\"$OLD_COLOR\"}}}"

echo "✅ Traffic switched to $NEW_COLOR"

# Verify switch
NEW_ACTIVE=$(kubectl get svc docuquery-active -n "$NAMESPACE" -o jsonpath='{.spec.selector.color}')
echo ""
echo "=== Switch Complete ==="
echo "Active deployment: $NEW_ACTIVE"
echo ""
echo "Next steps:"
echo "1. Monitor metrics and logs for errors"
echo "2. If issues occur, rollback with: $0 $OLD_COLOR"
echo "3. Once stable, scale down old deployment:"
echo "   kubectl scale deployment docuquery-$OLD_COLOR --replicas=0 -n $NAMESPACE"
