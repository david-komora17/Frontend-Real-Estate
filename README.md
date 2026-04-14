# Real Estate Rental Management System
A comprehensive, full-stack rental property dashboard designed to streamline the interaction between property managers and tenants. This platform provides a centralized "single source of truth" for property listings, booking schedules, and user management.
##  Project Overview
This project addresses the complexities of modern real estate by replacing scattered manual records with a unified digital interface. It focuses on secure Role-Based Access Control (RBAC), allowing administrators to manage high-level portfolio data while providing users with a seamless booking experience.
###  Key Features
* Role-Based Authentication: Secure login via Firebase Auth with distinct permissions for Admins (portfolio overview, maintenance tracking) and Users (personal bookings, profile management).
* Calendar-Based Booking: An interactive calendar system for real-time availability tracking and scheduling rental viewings or stays.
* Dynamic Dashboard: A responsive data-driven interface using Redux Toolkit to manage global state, ensuring synchronized data across all components without unnecessary re-renders.
* Complex Form Handling: Robust property listing and booking forms integrated with validation logic to ensure data integrity before persistence in Firestore.
* Real-Time Data Persistence: Leverages Firebase to provide up-to-the-minute updates on property status, occupancy rates, and rental revenue.
### Tech Stack
* Frontend: React (Vite), Tailwind CSS, Lucide React (Icons)
* State Management: Redux Toolkit (RTK)
* Backend/Database: Firebase Firestore & Firebase Authentication
* Routing: React Router (with Protected Routes)
  
### Technical Challenges Overcome
* Syncing Auth with Global State: Implemented a Firebase listener that populates the Redux store with the user’s specific role from Firestore upon login.
* RBAC Implementation: Created a higher-order ProtectedRoute component to prevent unauthorized access to administrative panels.
* Nested Git Conflict: Resolved complex version control issues involving "ghost submodules" to ensure a clean, deployable repository.
* Pro-Tip for your README:
### How to get started
<code>
git clone <[text](https://github.com/david-komora17/Frontend-Real-Estate.git)>
npm install
npm run dev
</code>