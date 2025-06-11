# Health check scripts container
FROM denoland/deno:alpine-1.46.3

# Install required tools
RUN apk add --no-cache \
    kubectl \
    curl \
    jq \
    bash

# Create scripts directory
WORKDIR /scripts

# Copy health check scripts
COPY scripts/k8s-health-check.ts ./
COPY scripts/storage-health-check.ts ./
COPY scripts/network-monitor.ts ./
COPY scripts/flux-deployment-check.ts ./
COPY scripts/types/monitoring.ts ./types/

# Copy shared utilities if any
COPY scripts/cli/shared/ ./cli/shared/

# Make scripts executable
RUN chmod +x *.ts

# Cache dependencies
RUN deno cache *.ts

# Default command
CMD ["echo", "Health check container ready"]