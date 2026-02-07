# Blog Platform Backend

A Node.js Express REST API backend for a blog platform with user authentication, role-based access control, and blog management.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blog-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blog_platform
PORT=5000
```

### 4. Database Setup (Local MySQL)

Ensure MySQL is running on your system, then:

```bash
# Create the database and tables
mysql -u root -p < schema.sql
```

Or the database will be automatically initialized on first application run.

### 5. Install nodemon (Optional - for development)

```bash
npm install --save-dev nodemon
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL database host | localhost |
| `DB_USER` | MySQL database user | root |
| `DB_PASSWORD` | MySQL database password | - |
| `DB_NAME` | MySQL database name | blog_platform |
| `PORT` | Server port | 5000 |

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## Docker Setup

### Prerequisites

- Docker and Docker Compose installed on your system

### Running with Docker Compose

1. Ensure the `.env` file or `docker-compose.yml` is properly configured

2. Start the services:

```bash
docker-compose up -d
```

3. Check service logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f mysql
```

4. Stop the services:

```bash
docker-compose down
```

### Docker Compose Configuration

The `docker-compose.yml` includes:

- **MySQL Service**: Runs MySQL 8.0 with auto-initialization via `schema.sql`
- **Backend Service**: Node.js Express application
- **Network**: Custom network for service communication
- **Volumes**: Persistent MySQL data storage

### Building Docker Image Only

```bash
docker build -t blog-backend .
```

### Running Container Manually

```bash
docker run -p 5000:3000 \
  -e DB_HOST=mysql_host \
  -e DB_USER=root \
  -e DB_PASSWORD=517672 \
  -e DB_NAME=blog_platform \
  blog-backend
```

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role":"admin"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",

}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
}
```

### Blog Endpoints

#### Create Blog (Authenticated)

```http
POST /blog
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My First Blog",
  "content": "This is my first blog post...",
  "summary": "A brief summary of the blog"
}
```

**Response (201):**
```json
{
  "message": "Blog created successfully",
  "blogId": 1
}
```

#### Get All Blogs

```http
GET /blog
```

**Response (200):**
```json
{
  "message": "Blogs retrieved successfully",
  "blogs": [
    {
      "id": 1,
      "title": "My First Blog",
      "content": "This is my first blog post...",
      "summary": "A brief summary of the blog",
      "user_id": 1,
      "created_at": "2026-02-07T10:30:00.000Z"
    }
  ]
}
```

#### Get Blog by ID

```http
GET /blog/:id
```

**Response (200):**
```json
{
  "message": "Blog retrieved successfully",
  "blog": {
    "id": 1,
    "title": "My First Blog",
    "content": "This is my first blog post...",
    "summary": "A brief summary of the blog",
    "user_id": 1,
    "created_at": "2026-02-07T10:30:00.000Z"
  }
}
```

#### Update Blog (Authenticated)

```http
PUT /blog/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "summary": "Updated summary"
}
```

**Response (200):**
```json
{
  "message": "Blog updated successfully"
}
```

#### Delete Blog (Authenticated - Admin Only)

```http
DELETE /blog/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Blog deleted successfully"
}
```

### User Endpoints

#### Get All Users (Authenticated - Admin Only)

```http
GET /user
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Users retrieved successfully",
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2026-02-07T10:30:00.000Z"
    }
  ]
}
```

#### Get User by ID (Authenticated)

```http
GET /user/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "User retrieved successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2026-02-07T10:30:00.000Z"
  }
}
```

### Error Responses

All endpoints may return error responses:

```json
{
  "message": "Error message describing what went wrong"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin','user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Description:**
- `id`: Unique identifier for each user (Auto-incremented)
- `name`: User's full name (max 100 characters)
- `email`: User's email address (unique, max 100 characters)
- `password`: Hashed password using bcryptjs
- `role`: User role - either 'admin' or 'user' (default: 'user')
- `created_at`: Timestamp of user creation (auto-set to current time)

**Indexes:**
- Primary Key on `id`
- Unique constraint on `email`

### Blogs Table

```sql
CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  summary TEXT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Description:**
- `id`: Unique identifier for each blog (Auto-incremented)
- `title`: Blog post title (max 255 characters)
- `content`: Full blog post content (unlimited text)
- `summary`: Brief summary of the blog (unlimited text)
- `user_id`: Foreign key referencing the user who wrote the blog
- `created_at`: Timestamp of blog creation (auto-set to current time)

**Relationships:**
- Foreign Key `user_id` references `users(id)`
- `ON DELETE CASCADE`: When a user is deleted, all their blogs are deleted automatically

**Indexes:**
- Primary Key on `id`
- Foreign Key on `user_id`

### Database Relationships

```
users (1) ---> (many) blogs
```

One user can have multiple blogs, but each blog belongs to only one user.

## Project Structure

```
blog-backend/
├── src/
│   ├── app.js                 # Express app initialization
│   ├── config/
│   │   └── db.js              # Database connection pool
│   ├── controllers/
│   │   ├── auth.controller.js # Auth endpoints logic
│   │   ├── blog.controller.js # Blog endpoints logic
│   │   └── user.controller.js # User endpoints logic
│   ├── middlewares/
│   │   ├── auth.middleware.js # JWT verification middleware
│   │   └── role.middleware.js # Role-based access control
│   ├── routes/
│   │   ├── auth.routes.js     # Auth routes
│   │   ├── blog.routes.js     # Blog routes
│   │   ├── user.routes.js     # User routes
│   │   └── common.routes.js   # Main API router
│   ├── services/
│   │   ├── auth.service.js    # Auth business logic
│   │   └── blog.service.js    # Blog business logic
│   └── utils/
│       ├── initializeDb.js    # Database initialization
│       └── summary.js         # Utility functions
├── schema.sql                 # Database initialization script
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Docker image configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Development Notes

### Adding New Features

1. Create a controller in `src/controllers/`
2. Add business logic to `src/services/` if needed
3. Create routes in `src/routes/`
4. Update `src/routes/common.routes.js` to include new routes
5. Add middleware if authentication or role checks are needed

### Authentication Flow

1. User registers with email and password
2. Password is hashed with bcryptjs
3. User can login with email and password
4. On successful login, a JWT token is returned
5. Include token in `Authorization: Bearer {token}` header for protected routes
6. Token is verified using `auth.middleware.js`

### Role-Based Access Control

- `admin`: Can perform all actions including deleting blogs
- `user`: Can read blogs, create/update own blogs, but cannot delete




