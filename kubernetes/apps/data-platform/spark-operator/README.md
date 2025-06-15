# Spark Operator Deployment

This directory contains the Kubeflow Spark Operator deployment for the data platform, implementing Phase 2 objective 2.1.

## Overview

The Spark Operator manages the lifecycle of Apache Spark applications on Kubernetes using Custom Resource Definitions (CRDs). It provides:

- **SparkApplication CRD**: Declarative Spark job definitions
- **Webhook Controller**: Admission controller for automatic configuration
- **Lifecycle Management**: Automated creation, monitoring, and cleanup of Spark resources
- **Prometheus Integration**: Metrics collection and monitoring

## Components

### Core Resources

- **HelmRelease** (`helmrelease.yaml`): Kubeflow Spark Operator v2.2.0 deployment
- **ServiceMonitor** (`servicemonitor.yaml`): Prometheus metrics scraping configuration
- **RBAC** (`rbac.yaml`): Service account and permissions for Spark applications

### Configuration Highlights

- **Spark Version**: 3.5.5 (latest supported)
- **Image Repository**: `ghcr.io/kubeflow/spark-operator` (v2.2.0+)
- **Webhook**: Enabled with admission controller
- **Namespace**: `data-platform`
- **Monitoring**: Prometheus ServiceMonitor enabled

### Example Resources

- **SparkApplication** (`example-sparkapplication.yaml`): Sample Spark Pi job
  - Commented out in kustomization - uncomment to test
  - Uses `spark-application-sa` service account
  - Configured for cluster mode execution

## Deployment

The operator is deployed via Flux GitOps:

1. **Repository**: Kubeflow Helm repository (`kubernetes/flux/meta/repos/kubeflow.yaml`)
2. **Kustomization**: Flux manages the deployment (`ks.yaml`)
3. **Dependencies**: Requires `data-platform` namespace

## Usage

### Creating Spark Applications

```yaml
apiVersion: sparkoperator.k8s.io/v1beta2
kind: SparkApplication
metadata:
  name: my-spark-job
  namespace: data-platform
spec:
  type: Scala
  mode: cluster
  image: "apache/spark:3.5.5"
  mainClass: org.apache.spark.examples.SparkPi
  serviceAccount: spark-application-sa
  # ... additional configuration
```

### Monitoring

- **Operator Metrics**: Available at `/metrics` endpoint
- **Application Metrics**: Exposed via driver/executor metrics
- **Grafana**: Dashboards for Spark application monitoring

### RBAC

- **Operator SA**: Created by Helm chart with cluster-wide permissions
- **Application SA**: `spark-application-sa` with namespace-scoped permissions
- **Permissions**: Pod management, secret access, SparkApplication CRDs

## Testing

To test the deployment:

1. Uncomment `example-sparkapplication.yaml` in `kustomization.yaml`
2. Commit and push changes
3. Monitor deployment: `kubectl get sparkapplications -n data-platform`
4. Check logs: `kubectl logs -n data-platform -l app.kubernetes.io/name=spark-pi-example`

## Troubleshooting

### Common Issues

1. **Webhook Certificate Issues**: Check cert-manager or self-signed certificates
2. **RBAC Permissions**: Verify service account permissions
3. **Image Pull**: Ensure Spark images are accessible
4. **Resource Limits**: Adjust CPU/memory limits as needed

### Debugging Commands

```bash
# Check operator status
kubectl get pods -n data-platform -l app.kubernetes.io/name=spark-operator

# View operator logs
kubectl logs -n data-platform -l app.kubernetes.io/name=spark-operator

# Check webhook configuration
kubectl get validatingwebhookconfigurations | grep spark

# Monitor Spark applications
kubectl get sparkapplications -n data-platform -w
```

## Next Steps

With the Spark Operator deployed, you can:

1. Create Spark applications for data processing
2. Integrate with Iceberg tables for data lakehouse operations  
3. Connect to Nessie for catalog management
4. Implement batch processing workflows
5. Set up monitoring and alerting for Spark jobs