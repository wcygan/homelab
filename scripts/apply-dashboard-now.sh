#!/bin/bash
# Quick script to apply a dashboard immediately via ConfigMap

DASHBOARD_FILE=$1
DASHBOARD_NAME=$(basename $DASHBOARD_FILE .json)

if [ -z "$DASHBOARD_FILE" ]; then
    echo "Usage: $0 <dashboard.json>"
    exit 1
fi

# Create ConfigMap directly
kubectl create configmap grafana-dashboard-temp-$DASHBOARD_NAME \
    --from-file=$DASHBOARD_FILE \
    --namespace=monitoring \
    --dry-run=client -o yaml | \
    kubectl label -f - grafana_dashboard=1 --local -o yaml | \
    kubectl annotate -f - grafana_folder=Temp --local -o yaml | \
    kubectl apply -f -

echo "Dashboard applied! Check Grafana in the 'Temp' folder."
echo "Note: This is temporary. Add to Git for permanent deployment."