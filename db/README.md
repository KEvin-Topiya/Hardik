# Database Queries - PostgreSQL

This folder contains the SQL scripts required to set up the database.

## Scripts
- `schema.sql`: Tables for products, orders, and order items.
- `seed.sql`: Initial data with product info (taken from the React frontend).

## How to use
```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE meridian_db;"

# 2. Run schema
psql -U postgres -d meridian_db -f schema.sql

# 3. Add initial data
psql -U postgres -d meridian_db -f seed.sql
```
