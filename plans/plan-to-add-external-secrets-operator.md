# Plan to Add External Secrets Operator (ESO) with 1Password

## Objective
Use the External Secrets Operator to synchronize secrets stored in 1Password (via a self-hosted Connect server) into Kubernetes Secrets in a GitOps-friendly way.

## Prerequisites
- 1Password Connect Server deployed and reachable (see https://developer.1password.com/docs/connect/)
- Kubernetes Secret holding Connect credentials (`connect-credentials.json`) and Connect token
- External Secrets Operator installed in your cluster (https://external-secrets.io/latest/introduction/overview/)

## High-Level Steps

1. **Install External Secrets Operator**
   Deploy the ESO controller (via Helm or manifests) into its own namespace (`external-secrets`).

2. **Create Connect auth Secrets**
   - `connect-credentials` Secret: contains the Connect server JSON credentials file
   - `connect-token` Secret: contains the Connect access token string

3. **Define a ClusterSecretStore**
   Create a cluster-scoped store that points to your Connect server and references the auth Secrets:
   ```yaml
   apiVersion: external-secrets.io/v1
   kind: ClusterSecretStore
   metadata:
     name: onepassword-connect
   spec:
     provider:
       onepassword:
         host: "https://connect.mycompany.local:8080"        # URL of your Connect server
         credentials:
           secretRef:
             name: connect-credentials
             key: credentials.json                              # JSON file key in the Secret
         token:
           secretRef:
             name: connect-token
             key: token                                          # Access token key in the Secret
         # insecureSkipTLSVerify: true                           # Optional: set true if Connect uses self-signed certs
   ```

4. **Create ExternalSecret resources**
   For each 1Password item you need in Kubernetes, define an ExternalSecret:
   ```yaml
   apiVersion: external-secrets.io/v1
   kind: ExternalSecret
   metadata:
     name: db-credentials
     namespace: app-namespace
   spec:
     refreshInterval: 1h
     secretStoreRef:
       name: onepassword-connect
       kind: ClusterSecretStore
     target:
       name: db-credentials                         # Kubernetes Secret name
       creationPolicy: Owner
     data:
       - secretKey: username                        # Key in K8s Secret
         remoteRef:
           key: vaults/prod/items/db-creds           # Connect item path
           property: username                        # Field name in the item
       - secretKey: password
         remoteRef:
           key: vaults/prod/items/db-creds
           property: password
   ```
   Or use `dataFrom.extract` to load all fields from a document-type item:
   ```yaml
   spec:
     dataFrom:
       - extract:
           key: vaults/prod/items/tls-cert          # Document-type item path
           property: cert.pem                        # File field in the item
   ```

5. **GitOps Integration**
   - Add these manifests under a path like `kubernetes/external-secrets/onepassword/` in Git.
   - Create a Flux `Kustomization` in `kubernetes/flux/cluster/` to watch that path (with `prune: true`).
   - Commit & push; Flux will reconcile ESO, SecretStore, and ExternalSecrets into the cluster.

## Additional Notes

- **Provider Roles**: Use a `ClusterSecretStore` for 1Password so it can be referenced across namespaces.
- **Item Types**: Password-type items are ideal for single values; Document-type items (e.g., certificates) work for file-based secrets.
- **RBAC & Security**: Restrict ESO's RBAC to only necessary namespaces if you run multiple Connect servers or have multi-tenant needs.
- **Error Handling**: ESO will retry fetch and reapply policies; monitor `ExternalSecret` status for sync errors.
- **Patching / Overlays**: Use Kustomize overlays (JSON6902) to swap `secretStoreRef` in different environments (staging vs production).
