# 🛒 E-commerce API (Backend)

A RESTful API built to power a modern e-commerce experience. This backend handles user authentication, product management and order processing

## 🚀 Features
- **Authentication**: JWT-based user registration and login.
- **Product Management**: Full CRUD operations for products and categories.
- **Order Flow**: Shopping cart logic, checkout processing, and order history.
- **Security**: Password hashing, input validation, and CORS configuration.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Auth**:  JWT

## 🏁 Getting Started
1. **Clone the repo**: `git clone <https://github.com/saraFadel/myEcommerce_backend.git>`
2. **Install dependencies**: `npm install`
3. **Environment Variables**: Create a `.env` file with the following:
   - `PORT=<your-port>`
   - `MONGO_URI=<your-db-uri>`
   - `SECRET_KEY=<your-secret>`
   - `JWT_EXPIRES_IN=<your-time>`
   - `ALLOWED_ORIGINS=<your-front-url>`
   - `NODE_ENV=<development | production>`
   - `BACKEND_UPLOADS_URL=<your-backend-url_/_your_static_upload_folder>`  

4. **Run the server**: `npm start`


