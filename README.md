# 🩸 LifePulse — Blood Donor Finder & Request System

> **Full-Stack MERN Capstone Project**  
> An end-to-end web application that connects voluntary blood donors with hospital seekers in medical emergencies, featuring real-time status management, privacy preferences, and direct MongoDB Atlas integration.

---

## 📌 Table of Contents

1. [Project Overview & Problem Statement](#-project-overview--problem-statement)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Application Workflow](#-application-workflow)
5. [Folder Structure](#-folder-structure)
6. [Prerequisites](#-prerequisites)
7. [Step-by-Step MongoDB Atlas Setup Guide](#-step-by-step-mongodb-atlas-setup-guide)
8. [Environment Variables Configuration](#-environment-variables-configuration)
9. [Installation & Local Execution](#-installation--local-execution)
10. [REST API Documentation](#-rest-api-documentation)
11. [Mongoose Database Models](#-mongoose-database-models)
12. [Authentication & Security](#-authentication--security)
13. [Testing & Verification Guide](#-testing--verification-guide)
14. [Troubleshooting & Common Errors](#-troubleshooting--common-errors)
15. [Future Enhancements](#-future-enhancements)

---

## 📖 Project Overview & Problem Statement

In life-threatening medical emergencies, trauma cases, surgeries, and severe anemia, patients and their families often scramble to find compatible blood units. Reliance on unorganized social media posts or fragmented phone chains frequently leads to:
- Expired or duplicate inquiries.
- Unverified contacts and privacy leaks for willing donors.
- Critical delays in urgent blood transfusions.

**LifePulse** solves this problem by providing a centralized, authenticated web portal where:
- Registered donors can specify their blood group, location, availability, and privacy preferences.
- Hospitalized seekers can publish structured blood requests with unique tracking IDs, hospital details, and urgency levels.
- Donors can inspect relevant open requests and pledge donations with real-time status transitions (`Pending` ➔ `Accepted` ➔ `Completed`).

---

## ✨ Key Features

- **User Accounts & Authentication**: Secure registration and login using salted **bcrypt** password hashing and **JWT** (JSON Web Tokens). Persistent authentication across browser refreshes.
- **Donor Profile Management**: Customizable profile with blood group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), city, state, contact number, last donation date, search visibility toggle, and contact visibility controls (`RegisteredOnly`, `Always`, `OnRequest`).
- **Donor Search Engine**: Real-time filtering by blood group and city using MongoDB regex queries. Unavailable or hidden profiles are automatically excluded from public listings.
- **Blood Request Management**: Submit requests with hospital coordinates, units required, deadline, and urgency (`Normal`, `Urgent`, `Emergency`). Unique human-readable request IDs (`BR-XXXX-XXXX`).
- **Interactive Lifecycle Workflow**:
  - Donors can **Accept** open requests or **Decline/Withdraw** their pledge.
  - Requesters can **Cancel** pending requests.
  - Both requester and donor can mark fulfilled transfusions as **Completed**, automatically updating the donor's last donation date.
- **Real-Time Dynamic Dashboard**: Displays personalized statistics for both donors and seekers (Total Requests, Pending, Accepted, Completed, Pledged Commitments) calculated directly from MongoDB Atlas records.
- **Privacy & Safety Protection**: Masks donor contact numbers for unauthenticated visitors when requested, and prominently features medical suitability warnings.
- **Fully Responsive Healthcare UI**: Styled using dark red crimson (`#c81e1e`), crisp whites, slate accents, and Lucide React iconography.

---

## 🛠 Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js 18, Vite, React Router v6, Tailwind CSS, Lucide React, Axios |
| **Backend** | Node.js, Express.js REST API, CORS, Dotenv |
| **Database** | MongoDB Atlas Cloud Database, Mongoose ODM |
| **Security** | JSON Web Tokens (`jsonwebtoken`), bcrypt password hashing (`bcryptjs`) |
| **Dev Tools** | Concurrently (running client and server in one command), Nodemon |

---

## 🔄 Application Workflow

```text
  [ User Registers / Logs in ]
               │
               ▼
  ┌─────────────────────────┬─────────────────────────┐
  │                         │                         │
  ▼                         ▼                         ▼
[ Creates Blood Request ]  [ Searches Donors ]   [ Completes Donor Profile ]
  │                         │                         │
  ├─ Status: "Pending"      └─ Contacts Donor         └─ Appears in Search (if active)
  │
  ▼
[ Donor Views & Accepts Request ]
  │
  ├─ Status: "Accepted"
  ├─ Donor contact visible to Requester
  │
  ▼
[ Transfusion Verified at Hospital ]
  │
  ├─ Status: "Completed"
  └─ Donor's "lastDonationDate" updated in MongoDB
```

---

## 📁 Folder Structure

```text
Blood-Donor-Finder/
├── package.json               # Root scripts (install:all, dev, dev:server, dev:client)
├── .gitignore                 # Excludes node_modules and .env files
├── README.md                  # Complete documentation and setup guide
├── client/
│   ├── package.json           # Frontend dependencies (React, Vite, Tailwind, Axios)
│   ├── vite.config.js         # Vite configuration (port 5173)
│   ├── tailwind.config.js     # Tailwind CSS theme with crimson blood color palette
│   ├── postcss.config.js      # PostCSS configuration
│   ├── index.html             # HTML shell with Google Fonts Inter & meta tags
│   ├── .env.example           # Example frontend environment variables
│   ├── .env                   # Frontend environment configuration
│   └── src/
│       ├── main.jsx           # React DOM root render
│       ├── App.jsx            # Router and layout integration
│       ├── index.css          # Tailwind base & utility styles
│       ├── context/
│       │   └── AuthContext.jsx # Global JWT session & donor profile state
│       ├── services/
│       │   └── api.js         # Axios client with bearer token interceptor
│       ├── utils/
│       │   └── formatDate.js  # Date and countdown helper functions
│       ├── components/
│       │   ├── Navbar.jsx     # Responsive navbar with donor badge & mobile menu
│       │   ├── Footer.jsx     # Medical disclaimer and footer links
│       │   ├── ProtectedRoute.jsx # Route guard for logged-in users
│       │   ├── StatusBadge.jsx# Status chips (Pending, Accepted, Completed, etc.)
│       │   ├── UrgencyBadge.jsx # Urgency chips (Normal, Urgent, Emergency)
│       │   ├── Modal.jsx      # Confirmation dialog for destructive actions
│       │   └── Alert.jsx      # Success/error banner notifications
│       └── pages/
│           ├── Home.jsx       # Hero landing page & quick search
│           ├── Register.jsx   # User registration with donor opt-in
│           ├── Login.jsx      # User authentication
│           ├── Dashboard.jsx  # Real-time metrics & recent activity
│           ├── FindDonors.jsx # Donor discovery directory with filters
│           ├── CreateBloodRequest.jsx # Form for emergency requirements
│           ├── MyRequests.jsx # Requesters' tracking page with filter tabs
│           ├── RequestDetails.jsx # Full request view & action transitions
│           ├── DonorProfilePage.jsx # Edit blood group, availability & privacy
│           ├── About.jsx      # Project overview and architecture
│           └── NotFound.jsx   # 404 error page
└── server/
    ├── package.json           # Backend dependencies (Express, Mongoose, bcrypt, JWT)
    ├── server.js              # Express app bootstrap & route registration
    ├── .env.example           # Example backend environment variables
    ├── .env                   # Backend environment configuration
    ├── config/
    │   └── db.js              # Mongoose connection & error diagnosis
    ├── models/
    │   ├── User.js            # User authentication schema
    │   ├── DonorProfile.js    # Donor profile & privacy schema
    │   └── BloodRequest.js    # Blood request tracking schema
    ├── middleware/
    │   ├── auth.js            # JWT protection & optional authentication
    │   └── errorHandler.js    # Centralized HTTP & Mongoose error handling
    ├── routes/
    │   ├── authRoutes.js      # Register, login, and profile fetching
    │   ├── donorRoutes.js     # Search, create, and update donors
    │   ├── requestRoutes.js   # Submit, fetch, respond, and close requests
    │   └── dashboardRoutes.js # Real-time dashboard summaries
    ├── controllers/
    │   ├── authController.js
    │   ├── donorController.js
    │   ├── requestController.js
    │   └── dashboardController.js
    └── utils/
        └── generateRequestId.js # Unique Request ID generator (e.g. BR-XXXX-XXXX)
```

---

## 💻 Prerequisites

Ensure you have the following installed on your computer:
1. **Node.js**: Version 18.0.0 or later (Node 20+ recommended). Check with `node -v`.
2. **npm**: Version 9.0.0 or later. Check with `npm -v`.
3. A web browser (Google Chrome, Firefox, Microsoft Edge).
4. An internet connection (for MongoDB Atlas cloud access).

---

## 🌐 Step-by-Step MongoDB Atlas Setup Guide

Follow these exact steps to set up your free MongoDB database in the cloud:

### Step 1: Create a MongoDB Atlas Account
1. Open your browser and navigate to: **[https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)**.
2. Sign up with your Google account or email address.
3. Complete the brief initial setup questions (Select "Learning MongoDB" or "Student project").

### Step 2: Deploy a Free Shared Database Cluster
1. On the Atlas overview page, click the green **Create** or **Build a Database** button.
2. Select the **M0 Free (Shared)** tier (this is 100% free forever).
3. Choose your preferred Cloud Provider (e.g., **AWS**) and pick the region closest to you (e.g., *Mumbai / ap-south-1* or *Frankfurt / eu-central-1*).
4. Leave the Cluster Name as `Cluster0` or name it `BloodDonorFinder`.
5. Click **Create Deployment**.

### Step 3: Create a Database User (Credentials)
> ⚠️ **Important:** Database user credentials are **different** from your MongoDB Atlas website login email and password!
1. Under **Quickstart / Security Quickstart**:
2. Select **Username and Password** authentication.
3. Enter a username (e.g., `dbadmin` or `donor_user`).
4. Enter a secure password (e.g., `DonorPassword2026!`) or click "Autogenerate Secure Password".
5. **Copy down this username and password** into a safe note!
6. Click **Create User**.

### Step 4: Configure Network Access (Allow IP Addresses)
1. In the same Quickstart window (or by clicking **Network Access** in the left sidebar):
2. Under "Where would you like to connect from?", choose **My Local Environment**.
3. To ensure your development computer can reach the database from any local Wi-Fi or hotspot:
   - Click **Add IP Address**
   - Click **Allow Access from Anywhere** (enters `0.0.0.0/0`)
   - Click **Confirm**.
*(Note: In production you would restrict this, but for development `0.0.0.0/0` prevents connection timeouts).*

### Step 5: Get Your Node.js Connection String
1. Click **Database** in the left navigation sidebar.
2. Click the **Connect** button next to your cluster.
3. In the popup dialog, choose **Drivers** (under "Connect to your application").
4. Select **Driver: Node.js** and version `5.5 or later`.
5. You will see a connection string format similar to:
   ```text
   mongodb+srv://<db_username>:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
6. Click the **Copy** button.

### Step 6: Customize Your Connection String
1. Paste the copied string into a text editor.
2. Replace `<db_username>` with your database username (e.g. `dbadmin`).
3. Replace `<db_password>` with your database password (e.g. `DonorPassword2026!`).
   *(If your password contains special characters like `@` or `#`, URL-encode them, or use alphanumeric passwords).*
4. Specify the database name by inserting `blood_donor_db` before the `?` query parameters:
   ```text
   mongodb+srv://dbadmin:DonorPassword2026!@cluster0.abcde.mongodb.net/blood_donor_db?retryWrites=true&w=majority
   ```

### Step 7: Place the Connection String in `server/.env`
1. Open the file `server/.env` in your project folder.
2. Paste your completed URI into the `MONGODB_URI` line:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://dbadmin:DonorPassword2026!@cluster0.abcde.mongodb.net/blood_donor_db?retryWrites=true&w=majority
   JWT_SECRET=super_secret_blood_donor_jwt_key_2026_dev_mode
   CLIENT_URL=http://localhost:5173
   ```
3. Save the file.

> 🔒 **Security Notice:** Never commit your `server/.env` file or share your database password on GitHub. `.env` is already included in `.gitignore`.

---

## ⚙️ Environment Variables Configuration

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/blood_donor_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_blood_donor_jwt_key_2026_dev_mode
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Local Execution

### Option A: Run Both Frontend and Backend Concurrently (Recommended)

From the project root directory (`d:\Blood-Donor-Finder`):

```bash
# 1. Install all dependencies across root, server, and client in one command
npm run install:all

# 2. Start both server and client development servers together
npm run dev
```

- **Frontend Client**: Accessible at `http://localhost:5173`
- **Backend API**: Accessible at `http://localhost:5000`
- **Backend Health Check**: Accessible at `http://localhost:5000/api/health`

---

### Option B: Run Frontend and Backend in Separate Terminals

#### Terminal 1 — Start Backend Server:
```bash
cd server
npm install
npm run dev
```
*(You will see `✅ MongoDB Connected successfully to host` once your `server/.env` is configured).*

#### Terminal 2 — Start Frontend Client:
```bash
cd client
npm install
npm run dev
```
*(Open your browser to `http://localhost:5173`).*

---

## 📡 REST API Documentation

All API endpoints are prefixed with `/api`.

### 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Get current authenticated user profile & donor status |

### 2. Donor Endpoints (`/api/donors`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/donors/profile` | Private | Create or update donor profile for logged-in user |
| `PUT` | `/api/donors/profile` | Private | Update donor profile |
| `PATCH` | `/api/donors/availability` | Private | Toggle donor availability (`true`/`false`) |
| `GET` | `/api/donors` | Public* | Search donors by `bloodGroup`, `city`, and `state` |
| `GET` | `/api/donors/:id` | Public* | Fetch single donor card by ID |

*\* Optional authentication: Unauthenticated visitors see privacy-masked phone numbers if donor selected `RegisteredOnly`.*

### 3. Blood Request Endpoints (`/api/requests`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/requests` | Private | Submit blood request (`bloodGroup`, `hospitalName`, `city`, `unitsRequired`, `urgency`, etc.) |
| `GET` | `/api/requests/my` | Private | Get all requests created by the authenticated user |
| `GET` | `/api/requests/available` | Private | Get open `Pending` requests available for donors |
| `GET` | `/api/requests/:id` | Public | View request details by MongoDB `_id` or unique `requestId` |
| `PATCH` | `/api/requests/:id/respond` | Private | Donor accepts (`action: 'accept'`) or withdraws (`action: 'decline'`) |
| `PATCH` | `/api/requests/:id/cancel` | Private | Requester cancels pending request |
| `PATCH` | `/api/requests/:id/complete` | Private | Mark donation as fulfilled and completed |

### 4. Dashboard Endpoints (`/api/dashboard`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | Private | Fetch real-time metrics (created, pending, accepted, completed, pledged) |

---

## 🗄 Mongoose Database Models

### User Model (`server/models/User.js`)
```javascript
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date
}
```

### DonorProfile Model (`server/models/DonorProfile.js`)
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true, unique: true },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  availabilityStatus: { type: Boolean, default: true },
  lastDonationDate: { type: Date, default: null },
  isVisibleInSearch: { type: Boolean, default: true },
  contactVisibility: { type: String, enum: ['Always', 'RegisteredOnly', 'OnRequest'], default: 'RegisteredOnly' },
  createdAt: Date,
  updatedAt: Date
}
```

### BloodRequest Model (`server/models/BloodRequest.js`)
```javascript
{
  requestId: { type: String, required: true, unique: true }, // e.g. BR-2026-9842
  requesterId: { type: ObjectId, ref: 'User', required: true },
  patientReference: { type: String, required: true },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  hospitalName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  unitsRequired: { type: Number, required: true, min: 1, max: 50 },
  requiredBy: { type: Date, required: true },
  urgency: { type: String, enum: ['Normal', 'Urgent', 'Emergency'], default: 'Normal' },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined', 'Cancelled', 'Completed'], default: 'Pending' },
  acceptedBy: { type: ObjectId, ref: 'User', default: null },
  createdAt: Date,
  updatedAt: Date
}
```

> 💡 **Automatic Collection Creation:** You do **not** need to manually create collections or indexes in MongoDB Compass or Atlas. Mongoose automatically creates the `users`, `donorprofiles`, and `bloodrequests` collections and their compound indexes when the application runs and saves records.

---

## 🔒 Authentication & Security

1. **Password Hashing**: User passwords are encrypted using `bcryptjs` with an automated salt work factor of 10. Passwords are never stored as plain text.
2. **Stateless Authorization**: JWT tokens are signed using `JWT_SECRET` and expire in 30 days. The client automatically includes the token in the `Authorization: Bearer <token>` header via Axios request interceptors.
3. **Route Protection**: Sensitive endpoints verify tokens via the backend `protect` middleware, while the frontend uses `<ProtectedRoute>` to guard dashboard, profile, and request management views.
4. **Data Isolation & Permissions**: Users cannot cancel or alter requests created by others. Requesters cannot accept their own requests, and only authorized parties can transition statuses to `Completed`.
5. **Donor Privacy Consent**: Public search responses only return phone numbers if the donor chose `Always`, or if the user is authenticated and the donor chose `RegisteredOnly`.

---

## 🧪 Testing & Verification Guide

Follow this step-by-step test plan once your MongoDB Atlas string is added to `server/.env`:

1. **Health Check Verification**:
   - Open `http://localhost:5000/api/health` in your browser.
   - Verify `databaseConnected: true`.
2. **Register User A (Blood Seeker)**:
   - Navigate to `http://localhost:5173/register`.
   - Enter Name, Email, Password, uncheck donor opt-in.
   - Confirm you are logged in and redirected to the Dashboard.
3. **Register User B (Voluntary Donor)**:
   - Open an incognito browser window or log out and register a second account.
   - Opt in as a donor. Fill in Blood Group (e.g. `O+`), City (e.g. `Mumbai`), Phone (`9876543210`).
   - Save the Donor Profile.
4. **Test Donor Search**:
   - Navigate to **Find Donors**.
   - Filter by Blood Group: `O+`, City: `Mumbai`.
   - Confirm User B's donor card appears with the `Available` badge.
5. **Create a Blood Request (as User A)**:
   - Switch to User A. Go to **Request Blood** (`/create-request`).
   - Fill in: Blood Group: `O+`, Units: `2`, Hospital: `City Care Hospital`, City: `Mumbai`, Urgency: `Urgent`.
   - Submit the form. Notice the unique Request ID generated (e.g. `BR-2026-4821`).
6. **Accept Request (as User B)**:
   - As User B, navigate to the Request Details page.
   - Click **Accept & Pledge Blood Donation**.
   - Confirm in the dialog. The status immediately updates to `Accepted`.
7. **Verify Dashboard Metrics**:
   - Return to User A's Dashboard.
   - Notice the **Accepted** count is incremented to 1, and the status badge shows `Accepted` with User B's donor details.
8. **Mark as Completed**:
   - Click **Mark Donation Fulfilled & Completed**.
   - Status updates to `Completed`. User B's last donation date is automatically updated.

---

## 🩺 Troubleshooting & Common Errors

### 1. `MongooseError: Operation buffering timed out`
- **Cause**: The server cannot reach your MongoDB Atlas cluster.
- **Solution**:
  1. Open MongoDB Atlas ➔ **Network Access**.
  2. Verify that `0.0.0.0/0` (Allow access from anywhere) is present and active.
  3. Ensure your local internet or firewall is not blocking outbound port 27017.

### 2. `Authentication failed` or `bad auth`
- **Cause**: The database username or password in `server/.env` is incorrect.
- **Solution**:
  1. Go to MongoDB Atlas ➔ **Database Access**.
  2. Edit your database user, reset the password to a clean alphanumeric password (e.g., `DonorPassword2026!`), and update `server/.env`.

### 3. `Port 5000 is already in use`
- **Cause**: Another background process or previous node instance is occupying port 5000.
- **Solution**:
  - In PowerShell run: `Get-Process -Name node | Stop-Process -Force`
  - Or change `PORT=5001` in `server/.env` and `VITE_API_URL=http://localhost:5001/api` in `client/.env`.

---

## 🔮 Future Enhancements

- Automated SMS / WhatsApp emergency alerts to registered donors in the same hospital postal code.
- Geolocation distance calculation using MongoDB geospatial (`$nearSphere`) indexing.
- Hospital verification badge for authorized medical administrators.
- Gamified donor reward badges and annual milestone certificates for voluntary donors.

---

*Developed for Academic Project Submission & Demonstration.*
