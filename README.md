Smart Task App: Scalable REST API with Authentication & Role-Based Access

🚀 Project Overview

This project delivers a secure, full-stack Kanban-style task management application, built as a project assignment for the Backend Developer Internship role. The solution features a modular, RESTful API (Node.js/Express) with full user authentication, Role-Based Access Control (RBAC), and a modern, integrated React frontend (Tailwind CSS) for demonstration.

Core Features:

Secure Authentication: User Registration and Login using JWTs delivered via HttpOnly Cookies.

Role-Based Access (RBAC): Separate permissions enforced for user and admin roles, particularly around data visibility (users only see their tasks) and critical operations.

CRUD Operations: Full Create, Read, Update, and Delete functionality for the primary Task entity, including a dueDate field.

Modern Frontend: Responsive Kanban board UI built with React and Tailwind CSS.

API Versioning: All endpoints are versioned under /api/v1/.

💻 Local Setup & Installation

To run this application, you must have Node.js (v18+), npm/yarn, and a PostgreSQL database instance running locally.

1. Database Setup

Ensure your local PostgreSQL service is running.

Create a new database for the project (e.g., smarttaskdb).

2. Backend Setup (Node.js/Express)

Navigate to the backend directory:

cd backend


Install dependencies:

npm install


Create a .env file and configure your database and security settings:

# backend/.env
PORT=5000

# DATABASE CREDENTIALS (Update with your PostgreSQL details)
DB_NAME=smarttaskdb
DB_USER=smartuser
DB_PASSWORD=smartpass
DB_HOST=localhost
DB_PORT=5432

# SECURITY
JWT_SECRET=X5QpMc5ipwMunIpcRygop5iqW+igEmKiAaHF1NWR92w= # Use a strong, random string
JWT_COOKIE_EXPIRES_MS=86400000 # 1 day in milliseconds
FRONTEND_URL=http://localhost:5173 # Adjust if your React port is different


Start the backend server. Sequelize will automatically run migrations and sync the User/Task tables:

npm start


The API should be running at http://localhost:5000.

3. Frontend Setup (React/Vite)

Navigate to the frontend directory:

cd ../frontend 


Install dependencies:

npm install


Start the React development server:

npm run dev


The application should open at http://localhost:5173 (or similar).

🔑 Initial Testing & Credentials

1. Registration

Navigate to the Register screen and create two test users:

Admin User: Register with any details, then manually update the role column in the PostgreSQL Users table to admin.

Standard User: Register with the default role (user).

2. Access Control Verification

Standard User: Can only see/edit/delete tasks they create.

Admin User: Can see and modify ALL tasks created by any user (demonstrating RBAC).

📈 Scalability & Deployment Readiness Note

(This section addresses the evaluation criteria for architecture, security, and future readiness.)

Scalability & Deployment Readiness Note

This project, Smart Task App, was engineered with a layered, modular architecture and security-first principles to ensure high scalability and robustness for future development.

1. Architectural Modularity (Scalability)

The application follows the Model-View-Controller (MVC) pattern, with clean separation of concerns into dedicated directories: models, controllers, routes, and middleware.

Benefits: This modularity ensures easy maintenance and rapid feature expansion. New features (e.g., "Notifications" or a "User Profile" system) can be added as isolated modules without impacting the core Authentication or Task CRUD logic.

Future Scaling: The implementation uses clear API versioning (/api/v1/). This structure is ready to support horizontal scaling into a microservices architecture, allowing different services to be developed and deployed independently under future versions (e.g., /api/v2/).

2. Robust Security Implementation

Security was prioritized as a core design principle:

Password Hashing: Passwords are never stored in plain text. They are hashed using the highly resilient Bcrypt algorithm (with a salt round of 12).

Secure Authentication (HttpOnly Cookies): User sessions are managed using JSON Web Tokens (JWTs) delivered via secure, HttpOnly cookies. This prevents Cross-Site Scripting (XSS) attacks from accessing the token, which is a major security upgrade over storing tokens in local storage.

Role-Based Access Control (RBAC): Middleware checks the user's role (user vs. admin) directly from the authenticated session before executing protected routes, ensuring correct privilege separation.

3. Database Choice & Deployment

PostgreSQL (via Sequelize ORM): Chosen for its reliability, transactional integrity, and strong indexing capabilities, which are ideal for the relational nature of users and tasks.

Deployment Readiness: All sensitive configurations (DB credentials, JWT secret) are handled via environment variables (.env), ensuring the project is ready for seamless deployment to any cloud provider (e.g., AWS, Render, Heroku).

4. Optional Enhancements for High Traffic

For scaling under heavy load, the following future enhancements are straightforward to implement:

Caching (Redis): A Redis layer can be introduced to cache frequently accessed read-heavy responses (like the list of tasks or status configuration) to reduce database load and latency.

Containerization (Docker): The application is designed to be easily containerized, allowing for rapid deployment of multiple instances behind a load balancer for effective horizontal scaling.