package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"time"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	"github.com/lib/pq"
)

// Models
type Product struct {
	ID          int            `json:"id" db:"id"`
	Name        string         `json:"name" db:"name"`
	Price       int            `json:"price" db:"price"`
	Category    string         `json:"category" db:"category"`
	Material    string         `json:"material" db:"material"`
	Description string         `json:"description" db:"description"`
	Weight      string         `json:"weight" db:"weight"`
	Dimensions  string         `json:"dimensions" db:"dimensions"`
	Finish      string         `json:"finish" db:"finish"`
	Stone       string         `json:"stone" db:"stone"`
	Images      pq.StringArray `json:"images" db:"images"`
	IsNew       bool           `json:"is_new" db:"is_new"`
	CreatedAt   time.Time      `json:"created_at" db:"created_at"`
	SalesCount  int            `json:"sales_count" db:"sales_count"`
}

type HeroImage struct {
	ID        int       `json:"id" db:"id"`
	ImageUrl  string    `json:"image_url" db:"image_url"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type OrderRequest struct {
	CustomerName    string      `json:"customer_name"`
	CustomerPhone   string      `json:"customer_phone"`
	CustomerAddress string      `json:"customer_address"`
	RawMessage      string      `json:"raw_message"`
	Items           []OrderItem `json:"items"`
}

type OrderItem struct {
	ProductID int `json:"product_id"`
	Quantity  int `json:"quantity"`
}

type Order struct {
	ID           int            `json:"id" db:"id"`
	CustomerName string         `json:"customer_name" db:"customer_name"`
	CustomerPhone string        `json:"customer_phone" db:"customer_phone"`
	CustomerAddress string      `json:"customer_address" db:"customer_address"`
	TotalAmount  int            `json:"total_amount" db:"total_amount"`
	Status       string         `json:"status" db:"status"`
	RawMessage   string         `json:"raw_message" db:"raw_message"`
	CreatedAt    time.Time      `json:"created_at" db:"created_at"`
	Items        []OrderItemDetail `json:"items"`
}

type OrderItemDetail struct {
	ID              int    `json:"id" db:"id"`
	OrderID         int    `json:"order_id" db:"order_id"`
	ProductID       int    `json:"product_id" db:"product_id"`
	Quantity        int    `json:"quantity" db:"quantity"`
	PriceAtPurchase int    `json:"price_at_purchase" db:"price_at_purchase"`
	ProductName     string `json:"product_name" db:"product_name"`
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
		r.Get("/products/trending", app.getTrendingProducts)
		r.Get("/products/new", app.getNewProducts)
		r.Get("/products/{id}", app.getProduct)
		r.Post("/products", app.createProduct)
		r.Put("/products/{id}", app.updateProduct)
		r.Delete("/products/{id}", app.deleteProduct)
		r.Post("/upload", app.uploadImage)
		r.Post("/orders", app.createOrder)
		r.Get("/orders", app.getOrders)
		r.Get("/orders/track", app.trackOrders)
		r.Put("/orders/{id}/status", app.updateOrderStatus)
		r.Post("/track-whatsapp", app.trackWhatsAppClick)

		r.Get("/hero-images", app.getHeroImages)
		r.Post("/hero-images", app.addHeroImage)
		r.Delete("/hero-images/{id}", app.deleteHeroImage)
	})

	// Serve uploaded files
	workDir, _ := os.Getwd()
	filesDir := http.Dir(fmt.Sprintf("%s/uploads", workDir))
	r.Handle("/uploads/*", http.StripPrefix("/uploads/", http.FileServer(filesDir)))

	// Create uploads directory if it doesn't exist
	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		os.Mkdir("uploads", 0755)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe("127.0.0.1:"+port, r))
}

func (app *App) createProduct(w http.ResponseWriter, r *http.Request) {
	var p Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	err := app.DB.QueryRow(`
		INSERT INTO products (name, price, category, material, description, weight, dimensions, finish, stone, images, is_new)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id
	`, p.Name, p.Price, p.Category, p.Material, p.Description, p.Weight, p.Dimensions, p.Finish, p.Stone, pq.Array(p.Images), p.IsNew).Scan(&p.ID)

	if err != nil {
		log.Printf("Error creating product: %v", err)
		http.Error(w, "Failed to create product", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func (app *App) updateProduct(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var p Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	_, err := app.DB.Exec(`
		UPDATE products SET name=$1, price=$2, category=$3, material=$4, description=$5, weight=$6, dimensions=$7, finish=$8, stone=$9, images=$10, is_new=$11
		WHERE id=$12
	`, p.Name, p.Price, p.Category, p.Material, p.Description, p.Weight, p.Dimensions, p.Finish, p.Stone, pq.Array(p.Images), p.IsNew, id)

	if err != nil {
		log.Printf("Error updating product: %v", err)
		http.Error(w, "Failed to update product", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (app *App) deleteProduct(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	_, err := app.DB.Exec("DELETE FROM products WHERE id=$1", id)
	if err != nil {
		http.Error(w, "Failed to delete product", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (app *App) uploadImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20) // 10MB limit

	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to get image", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Generate unique filename
	filename := fmt.Sprintf("%d-%s", os.Getpid(), handler.Filename)
	filePath := fmt.Sprintf("uploads/%s", filename)

	f, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		http.Error(w, "Failed to save image", http.StatusInternalServerError)
		return
	}
	defer f.Close()

	// Copy the file content to the target file
	if _, err := file.Seek(0, 0); err != nil {
		http.Error(w, "Failed to reset file pointer", http.StatusInternalServerError)
		return
	}

	// Read the file content
	fileContent := make([]byte, handler.Size)
	file.Read(fileContent)
	f.Write(fileContent)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"filename": filename})
}

func (app *App) getProducts(w http.ResponseWriter, r *http.Request) {
	products := []Product{}
	query := `
		SELECT p.*, COALESCE(s.total_clicks, 0) as sales_count 
		FROM products p 
		LEFT JOIN product_sales_stats s ON p.id = s.product_id
		ORDER BY p.created_at DESC
	`
	err := app.DB.Select(&products, query)
	if err != nil {
		log.Printf("Error fetching products: %v", err)
		http.Error(w, "Failed to retrieve products", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func (app *App) getTrendingProducts(w http.ResponseWriter, r *http.Request) {
	products := []Product{}
	query := `
		SELECT p.*, COALESCE(s.total_clicks, 0) as sales_count 
		FROM products p 
		INNER JOIN product_sales_stats s ON p.id = s.product_id
		WHERE s.total_clicks > 0
		ORDER BY s.total_clicks DESC
		LIMIT 8
	`
	err := app.DB.Select(&products, query)
	if err != nil {
		log.Printf("Error fetching trending products: %v", err)
		http.Error(w, "Failed to retrieve trending products", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func (app *App) getNewProducts(w http.ResponseWriter, r *http.Request) {
	products := []Product{}
	query := `
		SELECT p.*, COALESCE(s.total_clicks, 0) as sales_count 
		FROM products p 
		LEFT JOIN product_sales_stats s ON p.id = s.product_id
		WHERE p.is_new = TRUE
		ORDER BY p.created_at DESC
		LIMIT 8
	`
	err := app.DB.Select(&products, query)
	if err != nil {
		log.Printf("Error fetching new products: %v", err)
		http.Error(w, "Failed to retrieve new products", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func (app *App) trackWhatsAppClick(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ProductID int `json:"product_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	_, err := app.DB.Exec("INSERT INTO whatsapp_clicks (product_id) VALUES ($1)", req.ProductID)
	if err != nil {
		log.Printf("Error tracking WhatsApp click: %v", err)
		http.Error(w, "Failed to track click", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (app *App) getProduct(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var product Product
	query := `
		SELECT p.*, COALESCE(s.total_clicks, 0) as sales_count 
		FROM products p 
		LEFT JOIN product_sales_stats s ON p.id = s.product_id
		WHERE p.id = $1
	`
	err := app.DB.Get(&product, query, id)
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
	err = tx.QueryRow("INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount, raw_message) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		req.CustomerName, req.CustomerPhone, req.CustomerAddress, total, req.RawMessage).Scan(&orderID)
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

func (app *App) getOrders(w http.ResponseWriter, r *http.Request) {
	var orders []Order
	query := `
		SELECT id, customer_name, 
		COALESCE(customer_phone, '') as customer_phone, 
		COALESCE(customer_address, '') as customer_address, 
		total_amount, status, 
		COALESCE(raw_message, '') as raw_message, 
		created_at 
		FROM orders 
		ORDER BY created_at DESC
	`
	err := app.DB.Select(&orders, query)
	if err != nil {
		log.Printf("Error fetching orders: %v", err)
		http.Error(w, "Failed to fetch orders", http.StatusInternalServerError)
		return
	}

	for i, order := range orders {
		var items []OrderItemDetail
		query := `
			SELECT oi.*, p.name as product_name 
			FROM order_items oi 
			JOIN products p ON oi.product_id = p.id 
			WHERE oi.order_id = $1
		`
		app.DB.Select(&items, query, order.ID)
		orders[i].Items = items
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

func (app *App) trackOrders(w http.ResponseWriter, r *http.Request) {
	phone := r.URL.Query().Get("phone")
	if phone == "" {
		http.Error(w, "Phone number required", http.StatusBadRequest)
		return
	}

	// Clean the input phone number (remove spaces, plus, etc for better matching)
	// but for now we'll just use a fuzzy LIKE search
	searchPattern := "%" + phone + "%"

	var orders []Order
	query := `
		SELECT id, customer_name, 
		COALESCE(customer_phone, '') as customer_phone, 
		COALESCE(customer_address, '') as customer_address, 
		total_amount, status, 
		COALESCE(raw_message, '') as raw_message, 
		created_at 
		FROM orders 
		WHERE customer_phone LIKE $1 
		ORDER BY created_at DESC
	`
	err := app.DB.Select(&orders, query, searchPattern)
	if err != nil {
		log.Printf("Error tracking orders: %v", err)
		http.Error(w, "Failed to fetch orders", http.StatusInternalServerError)
		return
	}

	for i, order := range orders {
		var items []OrderItemDetail
		query := `
			SELECT oi.*, p.name as product_name 
			FROM order_items oi 
			JOIN products p ON oi.product_id = p.id 
			WHERE oi.order_id = $1
		`
		app.DB.Select(&items, query, order.ID)
		orders[i].Items = items
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

func (app *App) updateOrderStatus(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	var body struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	_, err := app.DB.Exec("UPDATE orders SET status = $1 WHERE id = $2", body.Status, idStr)
	if err != nil {
		log.Printf("Error updating order status: %v", err)
		http.Error(w, "Failed to update status", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (app *App) getHeroImages(w http.ResponseWriter, r *http.Request) {
	images := []HeroImage{}
	err := app.DB.Select(&images, "SELECT * FROM hero_images ORDER BY id ASC")
	if err != nil {
		log.Printf("Error fetching hero images: %v", err)
		http.Error(w, "Failed to retrieve hero images", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(images)
}

func (app *App) addHeroImage(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ImageUrl string `json:"image_url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var newImg HeroImage
	err := app.DB.QueryRow(`
		INSERT INTO hero_images (image_url) VALUES ($1) RETURNING id, image_url, created_at
	`, req.ImageUrl).Scan(&newImg.ID, &newImg.ImageUrl, &newImg.CreatedAt)
	if err != nil {
		log.Printf("Error creating hero image: %v", err)
		http.Error(w, "Failed to create hero image", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newImg)
}

func (app *App) deleteHeroImage(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	_, err := app.DB.Exec("DELETE FROM hero_images WHERE id=$1", id)
	if err != nil {
		http.Error(w, "Failed to delete hero image", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
