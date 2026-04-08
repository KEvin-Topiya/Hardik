package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// Models
type Product struct {
	ID          int     `json:"id" db:"id"`
	Name        string  `json:"name" db:"name"`
	Price       int     `json:"price" db:"price"`
	Category    string  `json:"category" db:"category"`
	Material    string  `json:"material" db:"material"`
	Description string  `json:"description" db:"description"`
	Weight      string  `json:"weight" db:"weight"`
	Dimensions  string  `json:"dimensions" db:"dimensions"`
	Finish      string  `json:"finish" db:"finish"`
	Stone       string  `json:"stone" db:"stone"`
	ImageURL    *string `json:"image_url" db:"image_url"`
	CreatedAt   string  `json:"created_at" db:"created_at"`
}

type OrderRequest struct {
	CustomerName  string      `json:"customer_name"`
	CustomerEmail string      `json:"customer_email"`
	Items         []OrderItem `json:"items"`
}

type OrderItem struct {
	ProductID int `json:"product_id"`
	Quantity  int `json:"quantity"`
}

type App struct {
	DB *sqlx.DB
}

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// DB configuration (PostgreSQL)
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "postgres"
	}
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "meridian_db"
	}
	sslMode := os.Getenv("DB_SSLMODE")
	if sslMode == "" {
		sslMode = "disable" // for local dev
	}

	// PostgreSQL DSN format
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=%s", dbHost, dbUser, dbPass, dbName, sslMode)
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	app := &App{DB: db}

	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Routes
	r.Route("/api", func(r chi.Router) {
		r.Get("/products", app.getProducts)
		r.Get("/products/{id}", app.getProduct)
		r.Post("/orders", app.createOrder)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe("127.0.0.1:"+port, r))
}

func (app *App) getProducts(w http.ResponseWriter, r *http.Request) {
	var products []Product
	err := app.DB.Select(&products, "SELECT * FROM products")
	if err != nil {
		log.Printf("Error fetching products: %v", err)
		http.Error(w, "Failed to retrieve products", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func (app *App) getProduct(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var product Product
	err := app.DB.Get(&product, "SELECT * FROM products WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}

func (app *App) createOrder(w http.ResponseWriter, r *http.Request) {
	var req OrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Transaction to insert order and order items
	tx, err := app.DB.Beginx()
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	total := 0
	for _, item := range req.Items {
		var price int
		err := tx.Get(&price, "SELECT price FROM products WHERE id = $1", item.ProductID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Product %d not found", item.ProductID), http.StatusBadRequest)
			return
		}
		total += price * item.Quantity
	}

	var orderID int
	err = tx.QueryRow("INSERT INTO orders (customer_name, customer_email, total_amount) VALUES ($1, $2, $3) RETURNING id",
		req.CustomerName, req.CustomerEmail, total).Scan(&orderID)
	if err != nil {
		log.Printf("Error inserting order: %v", err)
		http.Error(w, "Failed to process order", http.StatusInternalServerError)
		return
	}

	for _, item := range req.Items {
		var price int
		tx.Get(&price, "SELECT price FROM products WHERE id = $1", item.ProductID)
		_, err = tx.Exec("INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)",
			orderID, item.ProductID, item.Quantity, price)
		if err != nil {
			log.Printf("Error inserting order item: %v", err)
			http.Error(w, "Internal error processing item", http.StatusInternalServerError)
			return
		}
	}

	if err := tx.Commit(); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"order_id": orderID,
	})
}
