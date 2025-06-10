# Integration Tests

This directory contains integration tests that validate real infrastructure components and their interactions.

## Logging Stack Tests

**File**: `logging-stack.test.ts`  
**Purpose**: Validate the complete logging infrastructure: Loki + Ceph S3 backend + log ingestion pipeline

### Test Coverage

1. **Loki API Connectivity and Readiness**
   - Verifies Loki pods are running and ready
   - Tests Loki readiness endpoint
   - Validates Loki gateway service accessibility

2. **S3 Backend Configuration**
   - Confirms S3 credentials secret exists with required keys
   - Validates Loki HelmRelease is configured for S3 storage
   - Checks S3 endpoint points to Ceph RGW

3. **Ingestion Pipeline Verification**
   - Verifies Loki-canary pods are generating logs
   - Tests Loki labels API (indicates log ingestion is working)
   - Validates Loki push endpoint accessibility

4. **Ceph S3 Storage Backend**
   - Confirms ObjectBucketClaim exists for S3 bucket
   - Validates S3 credentials are properly configured
   - Checks for S3 connection errors in Loki logs
   - Verifies Rook-Ceph RGW pods are running

### Key Validations

✅ **Loki Deployment**: Confirms Loki is running and accessible  
✅ **S3 Integration**: Validates Ceph RGW backend is properly configured  
✅ **Log Ingestion**: Verifies logs are being received (via canary)  
✅ **Storage Backend**: Confirms S3 storage infrastructure is functional  

### Running Tests

```bash
# Run all logging tests
deno task test:logging

# Run all integration tests
deno task test:integration
```

### What's NOT Tested (Yet)

❌ **Alloy Log Collection**: Tests don't deploy Alloy agent for log collection  
❌ **Custom Workload Logs**: Tests don't verify logs from deployed applications  
❌ **Grafana Integration**: Tests don't verify Loki datasource in Grafana  

These gaps exist because:
- Alloy deployment has Helm chart issues (documented in milestone)
- No log collection agent is currently deployed
- Focus is on validating the core Loki + S3 infrastructure

### Value

These tests "lock down" the critical logging infrastructure components, ensuring:
- Regressions in Loki deployment are caught early
- S3 backend configuration changes are validated
- Infrastructure dependencies (Ceph RGW) are verified
- Log ingestion pipeline is functional

Perfect for CI/CD integration to prevent breaking changes to the logging stack.