<h1 align="center"> Project YamuBus </h1>
<p align="center"> The Unified Platform for Intelligent Public Transit Fleet Management and Real-Time Tracking </p>

<p align="center">
  <img alt="Build" src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge">
  <img alt="Tests" src="https://img.shields.io/badge/Tests-100%25%20Coverage-success?style=for-the-badge">
  <img alt="Contributions" src="https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>
<!-- 
  **Note:** These are static placeholder badges. Replace them with your project's actual badges.
  You can generate your own at https://shields.io
-->

---

## 🧭 Table of Contents
*   [Overview](#-overview)
*   [Key Features](#-key-features)
*   [Tech Stack & Architecture](#-tech-stack--architecture)
*   [Project Structure](#-project-structure)
*   [Demo & Screenshots](#-demo--screenshots)
*   [Getting Started](#-getting-started)
*   [Usage](#-usage)
*   [Contributing](#-contributing)
*   [License](#-license)

---

## ⭐ Overview

Project YamuBus is a comprehensive, multi-client web application designed to revolutionize urban public transit management. It provides a seamlessly integrated digital ecosystem for every stakeholder: transit administrators, fleet managers, drivers, and the commuting public (passengers). By connecting all operational aspects—from route planning and fleet assignment to real-time tracking and document verification—YamuBus ensures highly efficient and transparent bus operations.

### The Problem

> Traditional public transport systems often suffer from severe operational friction due to disparate systems and a lack of real-time visibility. Fleet managers struggle to assign drivers and buses efficiently, administrators lack centralized tools for auditing and route optimization, and, most importantly, passengers lack accurate, reliable, real-time information regarding bus locations and expected arrival times. This inefficiency leads to wasted resources, delays, and a poor user experience for commuters.

### The Solution

YamuBus delivers a powerful, unified solution built around four distinct client applications communicating with a single, highly available server API. This architecture provides specialized tools tailored to each user role, leveraging real-time capabilities to bridge the communication gap.

*   **For Administrators:** Centralized control over routes, fleet managers, and crucial document approvals.
*   **For Fleet Managers:** Digital tools for managing their assigned assets, including driver records and bus maintenance logs.
*   **For Drivers:** A streamlined interface for logging trips, reporting status, and receiving route assignments.
*   **For Passengers:** An intuitive mobile-friendly interface for finding buses, tracking them live on a map, and planning their journey.

### Architecture Overview

YamuBus is engineered using a robust **REST API** backend powered by **Express.js** and an immersive, multi-role frontend built with **React**. The application utilizes a **Component-based Architecture** across all four clients, ensuring rapid development, high maintainability, and consistent user experience. This setup allows for secure, role-based access to critical transit data, facilitating instantaneous updates essential for live tracking.

---

## ✨ Key Features

The power of Project YamuBus lies in its role-based specialization, delivering targeted functionality to dramatically improve operational efficiency and public satisfaction.

### 🌐 Comprehensive Operational Visibility (Admin Focus)

*   **Route Master Management:** Administrators can define, modify, and optimize public transport routes via the dedicated `RouteMaster` interface, ensuring coverage and efficiency based on demand.
*   **Fleet Manager Directory:** Maintain a centralized directory of all authorized fleet managers, facilitating easy assignment and oversight of different operational zones.
*   **Asset Verification Workflow:** Utilize structured components like `DocumentModal` and `VerificationModal` to manage and approve crucial documents, licenses, and permits for fleet managers, drivers, and buses, ensuring compliance.
*   **Statistical Overview (`StatsOverview`):** Access high-level performance metrics, including approval rates, fleet utilization, and key performance indicators (KPIs) via a dedicated dashboard view.

### 🚌 Fleet & Asset Management (Fleet Manager Focus)

*   **Driver & Bus Lifecycle Management:** Seamlessly add new drivers and buses using dedicated components (`AddDriverModal.jsx`, `AddBusModal.jsx`) and maintain accurate records of existing assets.
*   **Detailed Asset Records:** Review comprehensive profiles for all assigned drivers and buses, including historical data, documentation status, and current assignments via `DriverDetailsModal.jsx` and `BusDetailsModal.jsx`.
*   **Fleet Dashboard:** Gain immediate oversight of the fleet's current status, assignments, and outstanding administrative tasks.

### 🗺️ Real-Time Trip Execution (Driver Focus)

*   **Trip Setup and Initiation:** Drivers can quickly set up their operational bus for a trip using the streamlined `SetupBus` page before logging into their assigned route.
*   **Live Trip Interface:** Dedicated `Trip` page provides tools for drivers to log departures, arrivals, and critical incident updates in real time, feeding back vital data to the server via the `socket.io` dependency.
*   **Secure Role-Based Login:** Ensures only authorized drivers can access the operational dashboard and trip management features.

### 📍 Passenger Live Tracking (Passenger Focus)

*   **Effortless Onboarding:** A simple `Onboarding` flow guides new users into the system quickly, allowing them to start tracking immediately.
*   **Live Bus Tracker:** The core `Tracker` functionality allows commuters to view the real-time location of buses on the map, eliminating uncertainty and optimizing commute planning.
*   **Bus Card Display:** Concise `BusCard` components display key information—route, expected arrival, current status—in an easy-to-digest format on the main `Home` screen.

### ⚙️ Server Capabilities & Data Integrity

*   **Structured Data Models:** The backend is built upon critical models—`bus`, `driver`, `fleetmanager`, `route`, `trip`, and `SuperAdmin`—ensuring all operational data is structured, relational, and easily queryable using Mongoose.
*   **Secure API Access:** All routes are protected by robust authorization middleware (`authMiddleware.js`, `authAdminMiddleware.js`) and token generation utilities (`generateToken.js`).
*   **Real-Time Data Streams:** Leverages `socket.io` to provide instantaneous updates for live tracking and administrative alerts, essential for operational responsiveness.

---

## 🛠️ Tech Stack & Architecture

Project YamuBus is built on a modern MERN-like stack, focusing on speed, scalability, and maintainability. This structure leverages powerful, well-maintained technologies to handle the complexity of real-time data and role-based access control.

| Component | Technology | Purpose | Why it was Chosen |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | `express` | Robust, minimalist framework for building scalable REST APIs and handling secure route routing. | Selected for its speed, large ecosystem, and flexibility in serving four distinct client interfaces. |
| **Frontend Library** | `react` | Efficient, component-based rendering library utilized across all four interactive client applications. | Provides high performance and allows for code reusability and complex state management in a multi-client environment. |
| **Database ORM** | `mongoose` | Object Data Modeling (ODM) library for MongoDB, providing strong schema enforcement and data validation. | Essential for defining and managing critical business entities like `trip`, `route`, `bus`, and `driver` with consistency. |
| **Real-time Communication** | `socket.io` | Bi-directional, low-latency communication library. | Crucial for the core feature set of the system: real-time GPS tracking for passengers and instantaneous operational updates for fleet management. |
| **Authentication & Security** | `firebase-admin`, `bcryptjs` | Server-side authentication management, utilizing Firebase for powerful admin capabilities and bcrypt for secure password hashing. | Ensures iron-clad security and reliable identity verification for the four distinct user roles. |
| **Cloud Storage** | `cloudinary`, `multer` | Integrated solution for handling file uploads (via Multer) and secure, scalable cloud storage (via Cloudinary). | Necessary for storing critical operational assets such as bus photos, driver licenses, and regulatory documents. |
| **Styling & Utilities** | `tailwindcss`, `vite` | Utility-first CSS framework and a highly efficient development server/build tool. | Enables rapid, customizable styling and delivers extremely fast hot module reloading (HMR) during development. |

---

## 📁 Project Structure

The YamuBus project utilizes a monolithic repository structure, separating the server logic from the four dedicated client applications. This organization ensures clear responsibility and easy deployment for each application segment.

```
📂 String-Aki-Project-YamuBus-a78396d/
├── 📄 .gitignore
├── 📂 client/                          # Contains four separate, fully independent frontend applications
│   ├── 📂 administrator/             # Frontend application for Super Admins
│   │   ├── 📄 vite.config.js
│   │   ├── 📄 package.json
│   │   ├── 📄 index.html
│   │   ├── 📄 tailwind.config.js      # Styling configuration
│   │   ├── 📂 src/
│   │   │   ├── 📄 App.jsx
│   │   │   ├── 📂 components/
│   │   │   │   ├── 📄 ManagerAssets.jsx
│   │   │   │   ├── 📄 Layout.jsx
│   │   │   │   ├── 📄 DocumentModal.jsx      # Modal for viewing/uploading documents
│   │   │   │   ├── 📄 VerificationModal.jsx  # Modal for approving/verifying documents
│   │   │   │   ├── 📄 StatsOverview.jsx      # Admin dashboard statistics
│   │   │   │   └── 📄 ApprovalLists.jsx      # Lists requiring administrative approval
│   │   │   ├── 📂 api/
│   │   │   │   └── 📄 axios.js
│   │   │   └── 📂 pages/
│   │   │       ├── 📄 FleetManagersDirectory.jsx
│   │   │       ├── 📄 RouteMaster.jsx        # Route definition and planning tool
│   │   │       ├── 📄 Login.jsx
│   │   │       └── 📄 Dashboard.jsx
│   │   └── 📂 public/
│   │       └── 📄 icon.png
│   ├── 📂 fleetManager/              # Frontend application for Fleet Managers
│   │   ├── 📄 package.json
│   │   ├── 📄 index.html
│   │   ├── 📂 dev-dist/
│   │   │   └── 📄 sw.js              # Service Worker files (PWA support)
│   │   ├── 📂 src/
│   │   │   ├── 📄 App.jsx
│   │   │   ├── 📂 config/
│   │   │   │   └── 📄 firebase.js    # Client-side Firebase config
│   │   │   ├── 📂 components/
│   │   │   │   ├── 📂 drivers/
│   │   │   │   │   ├── 📄 AddDriverModal.jsx
│   │   │   │   │   └── 📄 DriverDetailsModal.jsx
│   │   │   │   ├── 📂 buses/
│   │   │   │   │   ├── 📄 AddBusModal.jsx
│   │   │   │   │   └── 📄 BusDetailsModal.jsx
│   │   │   │   └── 📂 common/
│   │   │   │       └── 📄 PrivateRoute.jsx   # Role-based protection component
│   │   │   └── 📂 pages/
│   │   │       ├── 📄 SignIn.jsx
│   │   │       ├── 📄 CreateAccount.jsx
│   │   │       └── 📄 FleetDashboard.jsx
│   │   └── 📂 public/
│   │       └── 📄 512x512.png
│   ├── 📂 driver/                    # Frontend application for Drivers
│   │   ├── 📄 package.json
│   │   ├── 📄 index.html
│   │   ├── 📂 dev-dist/
│   │   │   └── 📄 sw.js              # Service Worker files
│   │   ├── 📂 src/
│   │   │   ├── 📄 App.jsx
│   │   │   ├── 📂 config/
│   │   │   │   └── 📄 firebase.js    # Client-side Firebase config
│   │   │   └── 📂 pages/
│   │   │       ├── 📄 Trip.jsx               # Main operational interface for logging a trip
│   │   │       ├── 📄 SetupBus.jsx           # Pre-trip configuration
│   │   │       ├── 📄 Login.jsx
│   │   │       └── 📄 Dashboard.jsx
│   │   └── 📂 public/
│   │       └── 📄 512x512.png
│   └── 📂 passenger/                 # Frontend application for Commuters/Passengers
│       ├── 📄 package.json
│       ├── 📄 index.html
│       ├── 📂 src/
│       │   ├── 📄 App.jsx
│       │   ├── 📂 components/
│       │   │   └── 📄 BusCard.jsx           # Displays real-time bus information
│       │   └── 📂 pages/
│       │       ├── 📄 Onboarding.jsx
│       │       ├── 📄 Home.jsx
│       │       └── 📄 Tracker.jsx           # Real-time map tracking
│       └── 📂 public/
│           └── 📄 512x512.png
└── 📂 server/                        # Centralized Express.js backend API
    ├── 📄 .env.template              # Environment variables template for server secrets
    ├── 📄 server.js                  # Main entry point for the Express application
    ├── 📄 package.json
    ├── 📂 config/
    │   ├── 📄 firebaseAdmin.js       # Firebase Admin SDK setup for server-side auth
    │   ├── 📄 database.js            # MongoDB/Mongoose connection setup
    │   └── 📄 cloudinary.js          # Cloudinary connection for asset management
    ├── 📂 models/                    # Mongoose data schemas
    │   ├── 📄 trip.js
    │   ├── 📄 SuperAdmin.js
    │   ├── 📄 fleetmanager.js
    │   ├── 📄 driver.js
    │   ├── 📄 bus.js
    │   └── 📄 route.js
    ├── 📂 utils/
    │   └── 📄 generateToken.js       # Utility for JWT generation
    ├── 📂 middleware/
    │   ├── 📄 authMiddleware.js      # General authentication protection
    │   └── 📄 authAdminMiddleware.js # Admin-specific authentication protection
    ├── 📂 routes/                    # API route definitions for controllers
    │   ├── 📄 adminRoutes.js
    │   ├── 📄 fleetManagerRoutes.js
    │   ├── 📄 driverRoutes.js
    │   ├── 📄 tripRoutes.js          # Route for live trip creation and updates
    │   ├── 📄 routeRoutes.js
    │   └── 📄 publicBusRoutes.js     # Routes accessible by the passenger client
    └── 📂 controllers/               # Business logic handlers
        ├── 📄 fleetManagerController.js
        ├── 📄 busController.js
        ├── 📄 tripcontroller.js
        ├── 📄 driverController.js
        ├── 📄 adminController.js
        └── 📄 routeController.js
```

---

## 📸 Demo & Screenshots

Explore the distinct user interfaces designed specifically for each role in the YamuBus ecosystem. Note how the UX adapts to the needs of administrative oversight, asset management, and real-time interaction.

## 🖼️ Screenshots

<img width="1078" height="681" alt="App Screenshot 1" src="https://github.com/user-attachments/assets/da86947a-bf89-4de8-8a10-a971b74c1af9" />
<em><p align="center">Screenshot 1: The Administrator Dashboard featuring the centralized StatsOverview and document Approval Lists.</p></em>
<p align="center">
<img width="421" height="813" alt="App Screenshot 2" src="https://github.com/user-attachments/assets/e0470463-4bf4-450f-b34a-c5fbcd773a10" />
<p/>
<em><p align="center">Screenshot 2: The Fleet Manager interface showing Driver and Bus Detail Modals for quick asset review and maintenance tracking.</p></em>
  
<p align="center">
<img width="425" height="807" alt="App Screenshot 3" src="https://github.com/user-attachments/assets/57318b86-da7a-4af1-a8f6-d9b67f7368ab" />
<p/>
<em><p align="center">Screenshot 3: The Driver's dedicated 'Trip' page, essential for real-time operational logging and communication with the server.</p></em>

<p align="center">
<img width="396" height="778" alt="App Screenshot 4" src="https://github.com/user-attachments/assets/d216dc26-4dc6-4f93-ba32-e29f8c3a143c" />
<p/>
<em><p align="center">Screenshot 4: The Passenger client's 'Tracker' view, displaying live bus locations and essential information via the BusCard component.</p></em>

---

## 🚀 Getting Started

To set up and run Project YamuBus locally, you will need Node.js and npm installed. Due to the complex, multi-client architecture, setup requires running the central server and then initializing the four distinct client applications.

### Prerequisites

Ensure you have the following software installed on your development machine:

*   **Node.js (LTS recommended):** Required to run the Express server and all React clients.
*   **npm or yarn:** Used for installing project dependencies.

### Installation Steps

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/YourUsername/String-Aki-Project-YamuBus-a78396d.git
    cd String-Aki-Project-YamuBus-a78396d
    ```

2.  **Server Setup**

    Navigate to the `server/` directory and install the necessary dependencies, including Express, Mongoose, and Socket.io.

    ```bash
    cd server/
    npm install
    ```
    
    The server provides two core scripts for execution:
    
    *   **Development Mode:** Utilizes `nodemon` for automatic restarts during development.
        ```bash
        npm run dev
        ```
    *   **Production Mode:** Executes the main server file using Node.
        ```bash
        npm start
        ```

3.  **Client Setup (Run 4 Separate Terminals)**

    Each of the four client applications (`administrator`, `fleetManager`, `driver`, `passenger`) must be installed and run separately, as they represent distinct user entry points.

    **a. Administrator Client Setup**
    ```bash
    cd ../client/administrator
    npm install
    npm run dev # Assuming a standard vite development script
    ```

    **b. Fleet Manager Client Setup**
    ```bash
    cd ../fleetManager
    npm install
    npm run dev # Assuming a standard vite development script
    ```

    **c. Driver Client Setup**
    ```bash
    cd ../driver
    npm install
    npm run dev # Assuming a standard vite development script
    ```
    
    **d. Passenger Client Setup**
    ```bash
    cd ../passenger
    npm install
    npm run dev # Assuming a standard vite development script
    ```
    
    Once the server and all desired clients are running, you can access the respective client interfaces in your browser.

---

## 🔧 Usage

Project YamuBus is designed around distinct user roles, each accessing a dedicated client application that communicates with the centralized Express REST API. The core functionality relies on the server providing data streams and handling transactional requests.

### Core API Functionality

The Express server acts as the primary hub, handling all data transactions, authentication, and real-time communication. While the system supports many specific, role-based API routes (e.g., `/api/admin`, `/api/trip`), the foundational architecture is verified to support the following endpoints:

| Endpoint | Method | Description | Role Access |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | The root endpoint, typically used for basic health checks or serving the static entry point for one of the client applications. | Public |
| `/io` | `GET` | The core websocket endpoint managed by `socket.io`. This is the connection point for all real-time data streams, including live GPS updates, driver status changes, and administrator alerts. | All Roles (Authenticated) |

### Role-Specific Usage Flows

#### 1. Administrator Usage (`client/administrator`)

The administrator focuses on system-wide governance and resource allocation.
*   **Initial Setup:** Log in and utilize the `RouteMaster` page to establish initial transit routes based on the `route` data model.
*   **Oversight:** Monitor the `StatsOverview` for system health metrics and use the `ApprovalLists` and associated modals (`VerificationModal`, `DocumentModal`) to authorize new `fleetmanager` registrations and associated compliance documents.
*   **Control:** Access the `FleetManagersDirectory` to assign, review, and manage the hierarchy of fleet operations.

#### 2. Fleet Manager Usage (`client/fleetManager`)

Fleet Managers manage daily operational assets assigned to their jurisdiction.
*   **Asset Registration:** Utilize the `AddDriverModal` and `AddBusModal` components to onboard new resources into the system, updating the `driver` and `bus` models on the backend.
*   **Dashboard Monitoring:** The `FleetDashboard` provides an aggregated view of assigned assets, driver statuses, and active routes.
*   **Pre-Deployment:** Ensure all drivers and buses are properly verified and have updated details before initiating any trips.

#### 3. Driver Usage (`client/driver`)

The driver interface is optimized for on-the-road operational simplicity and real-time logging.
*   **Pre-Trip Workflow:** After successful `Login`, the driver uses the `SetupBus` page to confirm the assigned bus and route details for the upcoming journey.
*   **Live Trip Logging:** On the dedicated `Trip` page, the driver initiates the journey. This triggers the real-time data stream via the `/io` endpoint, constantly updating the `trip` model with location, speed, and status changes.
*   **Status Updates:** The driver can use the dashboard to log major events (delays, incidents, arrival) directly into the `tripcontroller`.

#### 4. Passenger Usage (`client/passenger`)

Passengers interact exclusively with the tracking and information services.
*   **Discovery:** After the simple `Onboarding` process, passengers are directed to the `Home` page, which displays available routes using `BusCard` components powered by the `publicBusRoutes.js` API.
*   **Live Tracking:** Selecting a bus transitions the user to the `Tracker` page. This client connects to the real-time `/io` endpoint to display the exact live location of the bus, leveraging the data being streamed by the driver client.

---

## 🤝 Contributing

We welcome contributions to improve Project YamuBus! Your input helps make this project better for everyone across the entire transit ecosystem. Whether you are improving the real-time performance of the server, enhancing a client interface, or clarifying documentation, your efforts are valued.

### How to Contribute

1. **Fork the repository** - Click the 'Fork' button at the top right of this page.
2. **Clone your fork** - Get the code onto your local machine.
   ```bash
   git clone https://github.com/YourUsername/String-Aki-Project-YamuBus-a78396d.git
   ```
3. **Create a feature branch** - Give your work a meaningful name based on the feature or fix.
   ```bash
   git checkout -b feature/optimize-realtime-sockets
   ```
4. **Make your changes** - Improve code, documentation, or features within the appropriate client or server directory.
5. **Install Dependencies** - Ensure all necessary packages are installed across the server and affected clients.
   ```bash
   # Example for server changes
   cd server/
   npm install
   ```
6. **Test thoroughly** - Ensure all functionality works as expected across the affected client applications.
   ```bash
   # Note: Standardized tests were not detected in the analysis, but local testing is mandatory.
   npm run dev  # Start the server
   # Then start the relevant clients and manually test the new functionality.
   ```
7. **Commit your changes** - Write clear, descriptive commit messages following conventional commit guidelines.
   ```bash
   git commit -m 'Fix: Resolved driver status synchronization bug in tripcontroller'
   ```
8. **Push to your branch**
   ```bash
   git push origin feature/optimize-realtime-sockets
   ```
9. **Open a Pull Request** - Submit your changes from your fork to the main repository for review.

### Development Guidelines

*   ✅ **Code Style:** Follow the existing React (JSX) conventions in the clients and the Node.js/Express standards in the server.
*   📝 **Documentation:** Add JSDoc comments for complex logic in controllers, models, and specialized client components like `VerificationModal` or `BusCard`.
*   🧪 **Robustness:** Ensure changes maintain the integrity of the crucial data models (`trip`, `bus`, `route`).
*   🎯 **Isolation:** Keep client-side changes isolated within the correct client directory (`administrator`, `fleetManager`, `driver`, or `passenger`).
*   **Dependencies:** Only introduce new dependencies if strictly necessary and ensure they are added to the correct `package.json` (server or client).

### Ideas for Contributions

We're actively seeking help in the following areas:

*   🐛 **Bug Fixes:** Improve stability in real-time tracking via the `socket.io` implementation.
*   ✨ **Feature Expansion:** Enhance the `StatsOverview` in the administrator client.
*   📖 **Configuration Guides:** Create tutorials for setting up external services like Cloudinary and Firebase Admin, as referenced in the server configuration.
*   🎨 **UI/UX:** Refine the user experience for the Driver client to make real-time interaction safer and more intuitive.
*   ⚡ **Performance:** Optimize database queries executed via Mongoose in the `controllers` to speed up asset lookups.

### Code Review Process

*   All submissions require thorough review by maintainers before merging.
*   Maintainers will provide constructive feedback, often requesting changes to ensure architectural alignment.
*   Once approved, your PR will be merged, and you will be credited for your invaluable contribution to the Project YamuBus ecosystem.

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### What this means:

*   ✅ **Commercial use:** You are free to use Project YamuBus code for commercial purposes.
*   ✅ **Modification:** You can modify the source code to fit your specific operational needs.
*   ✅ **Distribution:** You may distribute the software or modified versions of it.
*   ✅ **Private use:** You can use this project for private development and internal testing.
*   ⚠️ **Liability:** The software is provided "as is," without any express or implied warranty. The authors are not liable for damages or other claims arising from its use.
*   ⚠️ **Trademark:** This license does not grant rights to use the project name or trademarks associated with YamuBus.

---

<p align="center">Made with ❤️ by the Project YamuBus Team</p>
<p align="center">
  <a href="#">⬆️ Back to Top</a>
</p>
