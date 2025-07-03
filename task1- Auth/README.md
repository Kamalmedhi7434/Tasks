# Node.js Authentication System


## Features

- User registration with email validation
- Secure password hashing using bcrypt
- JWT token-based authentication
- MongoDB Atlas integration
- CORS enabled for cross-origin requests
- Input validation and error handling
- Database connection monitoring

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

## Error Handling

The API includes comprehensive error handling for:
- Database connection issues
- Validation errors
- Duplicate user registration
- Invalid login credentials
- Server errors

## Security Features

- Password hashing with bcrypt (salt rounds: 12)
- JWT token expiration
- Input validation and sanitization
- CORS configuration
- Database connection monitoring

## Troubleshooting

### Database Connection Issues

If you see "Database connection unavailable" errors:

1. Check your MongoDB Atlas IP whitelist
2. Verify your connection string in the `.env` file
3. Ensure your MongoDB Atlas cluster is running
4. Check your network connectivity

### Common Error Messages

- **"Database connection unavailable"**: IP not whitelisted in MongoDB Atlas
- **"User already exists"**: Email is already registered
- **"Invalid email or password"**: Login credentials are incorrect
- **"Please provide name, email, and password"**: Missing required fields

## Development

The application includes:
- Automatic server restart with nodemon (if installed)
- Detailed logging for debugging
- Environment variable configuration
- Graceful error handling

