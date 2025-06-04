# Testing CloudNative PostgreSQL

This guide covers how to test and interact with the CloudNative PostgreSQL database deployed in your Kubernetes cluster.

## Prerequisites

- `kubectl` configured to access your cluster
- `psql` PostgreSQL client installed locally
  - **macOS**: `brew install postgresql`
  - **Ubuntu/Debian**: `sudo apt-get install postgresql-client`
  - **Windows**: Download from [PostgreSQL Downloads](https://www.postgresql.org/download/)

## Database Connection Information

Your test PostgreSQL cluster provides these services:

- **Read/Write Service**: `test-postgres-cluster-rw.database.svc.cluster.local:5432`
- **Read-Only Service**: `test-postgres-cluster-r.database.svc.cluster.local:5432`
- **Database Name**: `appdb`
- **Username**: `appuser`
- **Password**: `TestPassword123!`

## Method 1: Port Forwarding (Recommended for Testing)

### Step 1: Set Up Port Forward

```bash
# Forward local port 5432 to the PostgreSQL read/write service
kubectl port-forward -n database svc/test-postgres-cluster-rw 5432:5432
```

Keep this terminal window open. You should see:
```
Forwarding from 127.0.0.1:5432 -> 5432
Forwarding from [::1]:5432 -> 5432
```

### Step 2: Connect with psql

Open a new terminal and connect:

```bash
# Connect to the database
psql -h localhost -p 5432 -U appuser -d appdb
# Enter password when prompted: TestPassword123!
```

Or use a connection string:
```bash
psql "postgresql://appuser:TestPassword123!@localhost:5432/appdb"
```

## Method 2: Direct Connection from Within Cluster

### Create a Test Pod

```bash
# Create a PostgreSQL client pod
kubectl run -n database postgres-client --rm -it --restart=Never \
  --image=postgres:16 -- bash

# Inside the pod, connect to PostgreSQL
psql -h test-postgres-cluster-rw -U appuser -d appdb
```

## Database Testing Examples

Once connected to PostgreSQL, you can run these test queries:

### 1. Basic Connection Test

```sql
-- Check PostgreSQL version and connection
SELECT version();

-- Check current database and user
SELECT current_database(), current_user;

-- List available databases
\l

-- List tables in current database
\dt
```

### 2. Create Test Schema and Tables

```sql
-- Create a test schema
CREATE SCHEMA IF NOT EXISTS test_schema;

-- Set search path to include our test schema
SET search_path TO test_schema, public;

-- Create a users table
CREATE TABLE test_schema.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Create a posts table
CREATE TABLE test_schema.posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES test_schema.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index for better query performance
CREATE INDEX idx_posts_user_id ON test_schema.posts(user_id);
CREATE INDEX idx_posts_created_at ON test_schema.posts(created_at);
```

### 3. Insert Test Data

```sql
-- Insert test users
INSERT INTO test_schema.users (username, email, full_name) VALUES
    ('john_doe', 'john@example.com', 'John Doe'),
    ('jane_smith', 'jane@example.com', 'Jane Smith'),
    ('bob_wilson', 'bob@example.com', 'Bob Wilson'),
    ('alice_brown', 'alice@example.com', 'Alice Brown'),
    ('charlie_davis', 'charlie@example.com', 'Charlie Davis');

-- Insert test posts
INSERT INTO test_schema.posts (user_id, title, content) VALUES
    (1, 'Getting Started with Kubernetes', 'Kubernetes is a powerful container orchestration platform...'),
    (1, 'CloudNative PostgreSQL Setup', 'Setting up PostgreSQL in Kubernetes using the CloudNative operator...'),
    (2, 'Database Best Practices', 'Here are some best practices for database design...'),
    (3, 'Monitoring Your Applications', 'Application monitoring is crucial for production systems...'),
    (4, 'Backup and Recovery Strategies', 'Having a solid backup strategy is essential...'),
    (5, 'Security in Cloud Native Applications', 'Security should be built into every layer of your application...');

-- Insert additional posts for some users
INSERT INTO test_schema.posts (user_id, title, content) VALUES
    (1, 'Advanced Kubernetes Concepts', 'Custom resources, operators, and advanced scheduling...'),
    (2, 'SQL Query Optimization', 'Tips and tricks for writing efficient SQL queries...'),
    (2, 'Database Indexing Strategies', 'Understanding when and how to use database indexes...');
```

### 4. Test Queries

```sql
-- Basic SELECT queries
SELECT * FROM test_schema.users;

SELECT * FROM test_schema.posts ORDER BY created_at DESC;

-- JOIN queries
SELECT
    u.username,
    u.full_name,
    p.title,
    p.created_at
FROM test_schema.users u
JOIN test_schema.posts p ON u.id = p.user_id
ORDER BY p.created_at DESC;

-- Aggregate queries
SELECT
    u.username,
    u.full_name,
    COUNT(p.id) as post_count
FROM test_schema.users u
LEFT JOIN test_schema.posts p ON u.id = p.user_id
GROUP BY u.id, u.username, u.full_name
ORDER BY post_count DESC;

-- Find users with more than 2 posts
SELECT
    u.username,
    COUNT(p.id) as post_count
FROM test_schema.users u
JOIN test_schema.posts p ON u.id = p.user_id
GROUP BY u.id, u.username
HAVING COUNT(p.id) > 2;

-- Recent posts (last 24 hours - for demo, we'll use a longer timeframe)
SELECT
    u.username,
    p.title,
    p.created_at
FROM test_schema.users u
JOIN test_schema.posts p ON u.id = p.user_id
WHERE p.created_at > CURRENT_TIMESTAMP - INTERVAL '1 day'
ORDER BY p.created_at DESC;

-- Full-text search in post content (basic example)
SELECT
    u.username,
    p.title,
    LEFT(p.content, 100) as content_preview
FROM test_schema.users u
JOIN test_schema.posts p ON u.id = p.user_id
WHERE p.content ILIKE '%kubernetes%'
   OR p.title ILIKE '%kubernetes%';
```

### 5. Update and Delete Operations

```sql
-- Update a user's information
UPDATE test_schema.users
SET full_name = 'John Michael Doe',
    email = 'john.doe@example.com'
WHERE username = 'john_doe';

-- Update post content
UPDATE test_schema.posts
SET content = 'Updated: Kubernetes is a powerful container orchestration platform that helps manage containerized applications...',
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Getting Started with Kubernetes';

-- Soft delete (mark user as inactive instead of deleting)
UPDATE test_schema.users
SET is_active = false
WHERE username = 'charlie_davis';

-- Delete a specific post
DELETE FROM test_schema.posts
WHERE title = 'Security in Cloud Native Applications';

-- Verify the changes
SELECT username, full_name, email, is_active FROM test_schema.users;
SELECT title, updated_at FROM test_schema.posts WHERE title LIKE '%Kubernetes%';
```

### 6. Advanced Queries and Features

```sql
-- Window functions
SELECT
    username,
    title,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY username ORDER BY created_at DESC) as post_rank
FROM test_schema.users u
JOIN test_schema.posts p ON u.id = p.user_id;

-- Common Table Expressions (CTEs)
WITH user_stats AS (
    SELECT
        u.id,
        u.username,
        COUNT(p.id) as total_posts,
        MAX(p.created_at) as last_post_date
    FROM test_schema.users u
    LEFT JOIN test_schema.posts p ON u.id = p.user_id
    GROUP BY u.id, u.username
)
SELECT
    username,
    total_posts,
    last_post_date,
    CASE
        WHEN last_post_date > CURRENT_TIMESTAMP - INTERVAL '7 days' THEN 'Active'
        WHEN last_post_date > CURRENT_TIMESTAMP - INTERVAL '30 days' THEN 'Recent'
        ELSE 'Inactive'
    END as activity_status
FROM user_stats
ORDER BY total_posts DESC;

-- JSON operations (PostgreSQL supports JSON)
SELECT
    username,
    jsonb_build_object(
        'total_posts', COUNT(p.id),
        'latest_post', MAX(p.title),
        'join_date', MIN(u.created_at)
    ) as user_summary
FROM test_schema.users u
LEFT JOIN test_schema.posts p ON u.id = p.user_id
WHERE u.is_active = true
GROUP BY u.id, u.username;
```

## Performance Testing

### Check Query Performance

```sql
-- Enable query timing
\timing on

-- Explain query execution plan
EXPLAIN ANALYZE
SELECT u.username, COUNT(p.id) as post_count
FROM test_schema.users u
LEFT JOIN test_schema.posts p ON u.id = p.user_id
GROUP BY u.id, u.username;

-- Check table sizes
SELECT
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'test_schema';

-- Check index usage
SELECT
    indexrelname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'test_schema';
```

## Database Administration Commands

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('appdb')) as database_size;

-- Check table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'test_schema';

-- Check active connections
SELECT
    datname,
    usename,
    client_addr,
    state,
    query_start
FROM pg_stat_activity
WHERE datname = 'appdb';

-- Check database configuration
SHOW ALL;

-- Specific important settings
SHOW shared_preload_libraries;
SHOW max_connections;
SHOW shared_buffers;
```

## Useful psql Commands

```sql
-- List databases
\l

-- Connect to a database
\c database_name

-- List schemas
\dn

-- List tables
\dt
\dt test_schema.*

-- Describe table structure
\d test_schema.users
\d+ test_schema.posts

-- List indexes
\di test_schema.*

-- Show table permissions
\dp test_schema.*

-- Execute SQL from file
\i /path/to/file.sql

-- Output query results to file
\o output.txt
SELECT * FROM test_schema.users;
\o

-- Get help
\?
\h CREATE TABLE
```

## Testing Read-Only Replica

To test the read-only service:

```bash
# Port forward to read-only service
kubectl port-forward -n database svc/test-postgres-cluster-r 5433:5432

# Connect to read-only replica
psql -h localhost -p 5433 -U appuser -d appdb
```

In the read-only connection:
```sql
-- These should work
SELECT * FROM test_schema.users;
SELECT COUNT(*) FROM test_schema.posts;

-- This should fail with read-only error
INSERT INTO test_schema.users (username, email) VALUES ('test', 'test@example.com');
```

## Cleanup Test Data

When you're done testing:

```sql
-- Drop test schema and all its tables
DROP SCHEMA test_schema CASCADE;

-- Verify cleanup
\dt
```

## Troubleshooting

### Connection Issues

```bash
# Check if port forward is running
lsof -i :5432

# Check PostgreSQL pod status
kubectl get pods -n database

# Check PostgreSQL logs
kubectl logs -n database test-postgres-cluster-1

# Check services
kubectl get svc -n database
```

### Authentication Issues

```bash
# Get credentials from secret
kubectl get secret -n database test-postgres-cluster-app -o jsonpath='{.data.username}' | base64 -d
kubectl get secret -n database test-postgres-cluster-app -o jsonpath='{.data.password}' | base64 -d
```

### Performance Issues

```sql
-- Check for locks
SELECT * FROM pg_locks WHERE NOT granted;

-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Summary

This testing setup provides:

✅ **Port forwarding** for external access
✅ **Schema creation** with relationships
✅ **Test data** with realistic examples
✅ **Complex queries** including JOINs, aggregations, and window functions
✅ **Performance testing** with EXPLAIN ANALYZE
✅ **Read-only replica** testing
✅ **Administrative commands** for monitoring

Your CloudNative PostgreSQL database is now fully tested and ready for application development!