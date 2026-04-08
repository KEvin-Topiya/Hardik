# Meridian - Svelte Frontend

The modernized, Svelte-based frontend for the Meridian Architectural Jewelry House.

## Features
- **Svelte 4**: Fast, lightweight, and reactive.
- **WhatsApp Ordering**: Directly message the studio to finalize orders.
- **Local Cart**: Persistent shopping cart without requiring user login.
- **Architectural Design**: Premium aesthetic with smooth transitions and geometric elements.
- **Go Backend Integration**: Fetches dynamic product data from the Go API.

## Requirements
- Node.js 18+
- Go Backend (running on port 8080)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

## WhatsApp Integration
The ordering system uses the `sendWhatsAppOrder` utility in `src/lib/whatsapp.js`. You can change the recipient phone number in that file.
