#!/bin/bash
# Script to copy S3 secret from storage namespace to data-platform namespace

echo "Copying S3 secret from storage to data-platform namespace..."
kubectl get secret rook-ceph-object-user-storage-iceberg -n storage -o yaml | \
  sed 's/namespace: storage/namespace: data-platform/' | \
  kubectl apply -f -

echo "Secret copied successfully!"