# Node.js Authentication & TODO System

## Features

### Authentication
- User registration with email validation
- Secure password hashing using bcrypt
- JWT token-based authentication
- MongoDB Atlas integration
- CORS enabled for cross-origin requests
- Input validation and error handling
- Database connection monitoring

### TODO Management
- Create TODOs (POST /api/todos)
- Read all user TODOs (GET /api/todos)
- Update a TODO (PUT /api/todos/:id)
- Delete a TODO (DELETE /api/todos/:id)
- Protected routes - only accessible with valid JWT
- User-specific TODOs (users can only access their own TODOs)
- Comprehensive error handling

## Prerequisites

- Node.js (version 16 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## Installation

1. Clone the repository or extract the project files
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Update the `.env` file with your MongoDB Atlas credentials:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=YourApp
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

2. **Important**: Make sure to whitelist your IP address in MongoDB Atlas:
   - Go to your MongoDB Atlas dashboard
   - Navigate to Network Access
   - Add your current IP address to the IP whitelist
   - Or add `0.0.0.0/0` for development (not recommended for production)

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```
   or
   ```bash
   node index.js
   ```

2. The server will start on port 3000 (or the port specified in your .env file)

## API Endpoints

### Health Check
- **GET** `/`
  - Returns API status and available endpoints

### Authentication

#### Register User
- **POST** `/api/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### Login User
- **POST** `/api/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### TODO Management (Protected Routes)

**Note**: All TODO endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer your_jwt_token_here
```

#### Create TODO
- **POST** `/api/todos`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Buy groceries",
    "description": "Milk, bread, eggs"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "TODO created successfully",
    "todo": {
      "_id": "todo_id",
      "title": "Buy groceries",
      "description": "Milk, bread, eggs",
      "completed": false,
      "user": "user_id",
      "createdAt": "2023-...",
      "updatedAt": "2023-..."
    }
  }
  ```

#### Get All TODOs
- **GET** `/api/todos`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "count": 2,
    "todos": [
      {
        "_id": "todo_id_1",
        "title": "Buy groceries",
        "description": "Milk, bread, eggs",
        "completed": false,
        "user": "user_id",
        "createdAt": "2023-...",
        "updatedAt": "2023-..."
      },
      {
        "_id": "todo_id_2",
        "title": "Walk the dog",
        "description": "",
        "completed": true,
        "user": "user_id",
        "createdAt": "2023-...",
        "updatedAt": "2023-..."
      }
    ]
  }
  ```

#### Update TODO
- **PUT** `/api/todos/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (all fields optional):
  ```json
  {
    "title": "Buy groceries and cook dinner",
    "description": "Milk, bread, eggs, chicken",
    "completed": true
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "TODO updated successfully",
    "todo": {
      "_id": "todo_id",
      "title": "Buy groceries and cook dinner",
      "description": "Milk, bread, eggs, chicken",
      "completed": true,
      "user": "user_id",
      "createdAt": "2023-...",
      "updatedAt": "2023-..."
    }
  }
  ```

#### Delete TODO
- **DELETE** `/api/todos/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "TODO deleted successfully",
    "todo": {
      "_id": "todo_id",
      "title": "Buy groceries",
      "description": "Milk, bread, eggs",
      "completed": false,
      "user": "user_id",
      "createdAt": "2023-...",
      "updatedAt": "2023-..."
    }
  }
  ```

## Error Handling

The API includes comprehensive error handling for:
- Database connection issues
- Authentication errors (missing token, invalid token, expired token)
- Validation errors
- Duplicate user registration
- Invalid login credentials
- Invalid TODO IDs
- Unauthorized access to TODOs
- Server errors

## Security Features

- Password hashing with bcrypt (salt rounds: 12)
- JWT token expiration
- Input validation and sanitization
- CORS configuration
- Database connection monitoring
- Protected routes with authentication middleware
- User-specific data access (users can only access their own TODOs)

## Testing

Run the comprehensive test suite:
```bash
node test-todo-api.js
```

This will test:
- Server health check
- Authentication endpoints
- Protected route access control
- Error handling
- Input validation

## Troubleshooting

### Database Connection Issues

If you see "Database connection unavailable" errors:

1. Check your MongoDB Atlas IP whitelist
2. Verify your connection string in the `.env` file
3. Ensure your MongoDB Atlas cluster is running
4. Check your network connectivity

### Authentication Issues

- **"Access token is required"**: Include `Authorization: Bearer <token>` header
- **"Invalid token"**: Token is malformed or incorrect
- **"Token expired"**: Get a new token by logging in again
- **"Invalid token - user not found"**: User account may have been deleted

### Common Error Messages

- **"Database connection unavailable"**: IP not whitelisted in MongoDB Atlas
- **"User already exists"**: Email is already registered
- **"Invalid email or password"**: Login credentials are incorrect
- **"Please provide name, email, and password"**: Missing required fields
- **"Title is required"**: TODO title is missing
- **"Invalid TODO ID"**: TODO ID format is incorrect
- **"TODO not found or you do not have permission"**: TODO doesn't exist or belongs to another user

## Development

The application includes:
- Automatic server restart with nodemon (if installed)
- Detailed logging for debugging
- Environment variable configuration
- Graceful error handling
- Comprehensive test suite

## Production Deployment

