# CRM Lead Management System

## Project Overview

This project is a full-stack Customer Relationship Management (CRM) system designed to help sales teams manage prospective customers. It allows users to track leads, monitor the sales pipeline, keep internal notes on prospects, and view aggregated analytics on a central dashboard. Originally developed with TypeScript, the project has been fully converted to pure JavaScript.

## Tech Stack Used

**Frontend:**
- **Framework:** Next.js (App Router) & React (JavaScript)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **State Management:** React Context API

**Backend:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs

## Features Implemented

- **Secure Authentication:** JWT-based login system for administrators.
- **Analytics Dashboard:** Real-time overview of total leads, pipeline value, won revenue, and leads categorized by status.
- **Lead Management (CRUD):** Create, read, update, and delete lead records with details like estimated deal value, source, and assigned salesperson.
- **Search & Filtering:** Easily search leads by name or filter them by their current status pipeline.
- **Internal Notes:** Add and track internal, timestamped notes for individual leads to keep a record of communications.

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "CRM Application"
   ```

2. **Start the Backend Server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *The backend runs on http://localhost:5000*

3. **Start the Frontend Application:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend runs on http://localhost:3000*

## Environment Variables

To run the backend properly, you need to configure your environment variables. Create a `.env` file in the `backend/` directory with the following keys:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm
JWT_SECRET=supersecretjwtkey123
```
*(No environment variables are strictly required for the frontend out of the box, as the API URL is defaulted to `http://localhost:5000/api`)*

## Database Setup

1. Ensure you have MongoDB installed and running locally on port `27017` (or update your `MONGODB_URI` accordingly).
2. To initialize the database with sample data and the default admin user, run the seed script:
   ```bash
   cd backend
   node seed.js
   ```

## Test Login Credentials

Once the database is seeded, you can log into the frontend using:

- **Email:** `admin@example.com`
- **Password:** `password123`

## Known Limitations

- **Pagination:** The leads table currently loads all records at once and lacks pagination, which could impact performance with massive datasets.
- **Role-Based Access Control (RBAC):** All logged-in users currently have the same administrative privileges.
- **Frontend Security:** Route protection relies on client-side Context checks rather than Next.js middleware, which is sufficient but less robust than server-side verification.
- **Password Recovery:** There is no "forgot password" flow implemented.

## Reflection

This project demonstrates a solid foundation for a modern, decoupled web application. Transitioning the codebase from TypeScript to pure JavaScript provided an interesting exercise in relying on functional component design and standard JavaScript idioms without compile-time type safety. The separation of concerns between the Express API and Next.js frontend allows for easy scalability. Future improvements could include migrating to a serverless database structure and adding more complex data visualizations on the dashboard.
