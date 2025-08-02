# oodo_hcakthon 
## Civic Track: Community Issue Reporting Platform
Civic Track is a full-stack web application built for the Odoo x CGC Mohali Hackathon '25. It empowers citizens to report local civic issues like potholes, garbage, and water leaks, and allows administrators to efficiently track and manage these reports. The platform is designed to foster community engagement and improve transparency in local governance.

## Features Implemented
Citizen Features
Secure Authentication: Users can register for a new account and log in securely using JWT-based authentication.

Geolocation-Based Dashboard: On login, the app automatically detects the user's location and displays a dashboard centered on their area.

Interactive Map: Issues are displayed as markers on an interactive map (powered by Leaflet.js).

Nearby Issue Feed: A real-time list of issues reported within a 5km radius is displayed alongside the map.

Issue Reporting: An intuitive form allows users to report new issues with a title, description, and category, automatically tagging them with their current location.

## Admin Features
Role-Based Access Control: The application distinguishes between regular citizens and administrators, providing a separate, secure dashboard for admins.

Admin Dashboard: A dedicated UI for administrators to view a comprehensive list of all issues reported on the platform.

Issue Status Management: Admins can update the status of any issue (e.g., from REPORTED to IN_PROGRESS or RESOLVED) directly from the dashboard.

Tech Stack
This project is built using a modern, robust, and scalable tech stack.

Backend
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL with the PostGIS extension for geospatial queries.

ORM: Prisma

Authentication: JWT (JSON Web Tokens) with bcryptjs for password hashing.

Middleware: cors for handling cross-origin requests, morgan for request logging.

Frontend
Framework: React (using Vite for a fast development environment)

Styling: Tailwind CSS for a utility-first, responsive design.

State Management: React Context API for global authentication state.

Routing: React Router

Mapping: Leaflet.js and React-Leaflet

API Communication: Axios

Setup and Installation
To get the project running locally, follow these steps.

Prerequisites
Node.js (v18 or later)

npm

A running PostgreSQL instance

1. Clone the Repository
Bash

git clone <your-repository-url>
cd civic-track
2. Backend Setup
Bash

# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and add your database URL and JWT secret
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
# JWT_SECRET="your_super_secret_key"

# Enable the PostGIS extension in your database by running this SQL command:
# CREATE EXTENSION IF NOT EXISTS postgis;

# Run the database migration to create tables
npx prisma migrate dev --name init

# Start the backend server
npm run dev
The backend server will be running on http://localhost:5000.

3. Frontend Setup
Bash

# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
The frontend application will be available at http://localhost:5173 (or another port specified by Vite).

API Endpoints
Method	Endpoint	Description	Access
POST	/api/users/register	Register a new user	Public
POST	/api/users/login	Authenticate a user and get token	Public
POST	/api/issues	Report a new civic issue	Private
GET	/api/issues	Get issues within a radius	Private
PATCH	/api/issues/:id/status	Update an issue's status	Admin
