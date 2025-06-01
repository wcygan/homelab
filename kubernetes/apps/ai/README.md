# AI/ML Infrastructure

This namespace hosts AI and machine learning infrastructure, including model serving with HUGS (Hugging Face model serving).

## HUGS Model Deployments

We have deployed two GGUF models using HUGS:

### 1. DeepSeek Model (`hugs-deepseek`)
- **Model**: `unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF`
- **Resources**: 4-8 CPU cores, 16-32GB memory
- **Service**: Available at `hugs-deepseek.ai.svc.cluster.local:8080`

### 2. Gemma Model (`hugs-gemma`)
- **Model**: `unsloth/gemma-3-4b-it-GGUF:Q4_K_XL`
- **Resources**: 2-4 CPU cores, 8-16GB memory
- **Service**: Available at `hugs-gemma.ai.svc.cluster.local:8080`

## Deployment Structure

```
kubernetes/apps/ai/
├── kustomization.yaml          # Namespace kustomization
├── hugs-deepseek/             # DeepSeek model deployment
│   ├── ks.yaml               # Flux Kustomization
│   └── app/
│       ├── kustomization.yaml
│       └── helmrelease.yaml   # Helm release configuration
└── hugs-gemma/                # Gemma model deployment
    ├── ks.yaml               # Flux Kustomization
    └── app/
        ├── kustomization.yaml
        └── helmrelease.yaml   # Helm release configuration
```

## Managing the Deployments

### Check Deployment Status
```bash
# Check if Flux has reconciled the deployments
flux get kustomizations -n flux-system | grep hugs

# Check HelmRelease status
flux get helmreleases -n ai

# Check pod status
kubectl get pods -n ai

# Check services
kubectl get svc -n ai
```

### View Logs
```bash
# DeepSeek logs
kubectl logs -n ai -l app.kubernetes.io/name=hugs-deepseek -f

# Gemma logs
kubectl logs -n ai -l app.kubernetes.io/name=hugs-gemma -f
```

### Updating Models or Configuration

1. **Update Chart Version**: Edit the `version` field in the respective `helmrelease.yaml`
2. **Change Model**: Modify the `image.name` and `image.tag` in the values
3. **Adjust Resources**: Update the `resources` section based on your needs
4. **Add GPU Support**: Uncomment the `nvidia.com/gpu` lines if you have GPUs

After making changes, commit and push to Git. Flux will automatically apply the updates.

### Exposing Services

The services are currently only accessible within the cluster. To expose them:

1. **Via Ingress**: Uncomment and configure the `ingress` section in `helmrelease.yaml`
2. **Via Tailscale**: Create a Tailscale ingress following the pattern in `kubernetes/apps/monitoring/kube-prometheus-stack/app/tailscale-grafana-ingress.yaml`
3. **Via Port Forward** (for testing):
   ```bash
   kubectl port-forward -n ai svc/hugs-deepseek 8080:8080
   kubectl port-forward -n ai svc/hugs-gemma 8081:8080
   ```

## API Usage

HUGS provides an OpenAI-compatible API. Once exposed, you can use it like:

```bash
# Example request to DeepSeek
curl http://localhost:8080/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF",
    "prompt": "Hello, how are you?",
    "max_tokens": 100
  }'
```

## Secrets Management

If you need to add Hugging Face tokens or other secrets:

1. Store them in 1Password
2. Create an ExternalSecret to sync them:

```yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: hugs-secrets
  namespace: ai
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: hugs-secrets
    creationPolicy: Owner
  data:
    - secretKey: hf-token
      remoteRef:
        key: HuggingFaceToken    # 1Password item name
        property: token          # field in the item
```

Then reference in the HelmRelease values as shown in the commented sections.

## Troubleshooting

1. **Pod not starting**: Check resource availability with `kubectl describe pod -n ai <pod-name>`
2. **Model download issues**: Check if the model name/tag is correct and if you need HF authentication
3. **OOM errors**: Increase memory limits in the HelmRelease
4. **Slow inference**: Consider adding GPU support or using a smaller quantization

## Next Steps

1. **TODO**: Update the HUGS chart version from `0.1.0` to the actual latest version
2. Consider setting up monitoring with Prometheus metrics
3. Add authentication if exposing externally
4. Set up model-specific ingress routes for your `anton` application to use