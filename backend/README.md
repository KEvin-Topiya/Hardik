# Backend - Go (PostgreSQL)

This backend provides a clean, fast, and lightweight API for the Meridian e-commerce website.

## Requirements
- Go 1.21+
- PostgreSQL database

## Setup
1. Init database:
   ```bash
   # Create database first (meridian_db)
   psql -d meridian_db -f ../db/schema.sql
   psql -d meridian_db -f ../db/seed.sql
   ```

2. Configure environment:
   ```bash
   export DB_USER=your_postgres_user
   export DB_PASS=your_password
   export DB_HOST=localhost
   export DB_NAME=meridian_db
   ```

3. Run server:
   ```bash
   cd backend
   go run main.go
   ```

## API Endpoints
- `GET /api/products`: List all products
- `GET /api/products/:id`: Get product by ID
- `POST /api/orders`: Place a new order
