# HotelPro — Hotel Management and Room Booking System

## Project Overview

**HotelPro** is a web-based Hotel Management System designed to simplify hotel operations through a secure, responsive, and user-friendly platform. Guests can browse rooms, create accounts, book rooms, review their reservations, and cancel bookings. Administrators can manage rooms, monitor bookings, and view registered users.

The application is planned around the MERN stack: MongoDB, Express.js, React, and Node.js.

> **Implementation note:** This document describes the architecture and workflows supplied for the project. Features such as payment processing, JWT protection, room editing/deletion, and specific API endpoints should be verified against the actual source code before being considered fully implemented.

---

# 1. Project Architecture

## 1.1 Technical Architecture

The technical architecture contains the following components:

1. **User Interface** — Provides the screens and controls through which visitors, customers, and administrators interact with HotelPro. Users can sign up, log in, browse rooms, and manage bookings.
2. **Web Server** — Hosts or serves the client application and handles incoming web requests.
3. **API Gateway** — Acts as the entry point for client requests and directs them to the appropriate backend endpoints or services. In a small Express application, this role may be fulfilled by the Express server and its routes rather than a separate gateway service.
4. **Authentication** — Handles registration and login, validates credentials, and establishes the user's authenticated session. The proposed design uses JSON Web Tokens (JWTs).
5. **User Dashboard** — Provides customer-specific functions after successful authentication, including room browsing and booking history.
6. **Admin Login and Dashboard** — Gives administrators access to booking, room, and user-management functions.
7. **Available Hotels / Rooms** — Displays available accommodation information. Availability should be calculated using the requested check-in and check-out dates.
8. **Database** — Stores user, room, and booking records. The project uses MongoDB with Mongoose models.

### High-level request flow

```text
User Interface
      |
      v
Web Server / Express API
      |
      v
Authentication and API Routes
      |
      +--------------------+
      |                    |
      v                    v
Customer Functions     Admin Functions
      |                    |
      +----------+---------+
                 |
                 v
          Controllers
                 |
                 v
           Mongoose Models
                 |
                 v
             MongoDB
```

The exact deployment may combine the web server and API routing in one Node.js/Express application.

## 1.2 Entity-Relationship (ER) Diagram

The ER model represents the main data entities: **User**, **Room**, **Booking**, and **CardDetails**.

### User

| Attribute | Description |
|---|---|
| `user_id` | Unique user identifier |
| `name` | User's full name |
| `email` | Email address used for account access |
| `password` | Stored password hash; passwords should not be stored as plain text |
| `c_password` | Confirm-password field used during registration validation; normally not stored after validation |
| `phone` | Contact number |
| `type` | Account role, such as `admin` or `customer` |

**Relationships:** A user can create multiple bookings. An administrator may also manage room records.

### Room

| Attribute | Description |
|---|---|
| `room_id` | Unique room record identifier |
| `roomNumber` | Room number or identifier |
| `description` | Room description |
| `photos` | Room image references or URLs |
| `type` | Room category, such as single, double, or suite |
| `rent` | Price per night or other defined rental period |
| `count` | Number of rooms available in this category, if category-based inventory is used |
| `currentBookings` | Reservation records or references used to calculate availability |

A room record may include booking-related fields such as `booking_id`, `fromdate`, `todate`, and `status`, depending on the implemented schema. A normalized design generally stores reservations in a separate Booking collection and links them to rooms by ID.

### Booking

| Attribute | Description |
|---|---|
| `booking_id` | Unique booking identifier |
| `room_id` | Reference to the booked room or room category |
| `user_id` | Reference to the customer who made the booking |
| `fromdate` | Check-in date |
| `todate` | Check-out date |
| `totaldays` | Number of booked days/nights, according to project rules |
| `status` | Booking state, for example active or cancelled |
| `totalAmount` | Total booking cost |
| `name` | Guest name associated with the reservation |

A booking belongs to one user and one room record. A user and a room may each be associated with many bookings over time.

### CardDetails (Payment Information)

| Attribute | Description |
|---|---|
| `cardNumber` | Payment card number |
| `cvvcode` | Card verification code |
| `expmonthyear` | Card expiry month and year |
| `cardholdername` | Name printed on the card |
| `totaldays` | Duration field shown in the supplied ER diagram, if required by the implementation |

**Security note:** Do not store raw card numbers or CVV values in the application database. Use a reputable payment provider and store only the provider's transaction/reference identifiers and the minimum permitted payment metadata. CVV must not be retained after authorization.

### Relationships

- **User → Booking:** One user can create many bookings.
- **Room → Booking:** One room record can be associated with many bookings over time.
- **Booking → Payment:** A booking may have a related payment record or payment-provider reference.
- **Room → Current bookings:** Reservation dates and statuses determine whether a room is available for a requested period.
- **Admin → Room management:** An administrator can create and manage room inventory, subject to authorization rules.

## 1.3 Features

### Customer Features

#### User Authentication
- Register with name, email, password, phone number, and account type where permitted.
- Log in with email and password.
- Validate required fields and confirm that the password matches the confirmation field.
- Use JWT-based authentication if configured in the backend.
- Restrict administrative privileges to authorized accounts. Public registration should not allow users to grant themselves the admin role.

#### User Dashboard (`UserHome`)
- Display a personalized welcome message.
- Navigate to room browsing and the user's booking history.
- Provide logout functionality.

#### Room Browsing
- View available rooms with images and descriptions.
- See room type, price, and relevant features.
- Search availability using check-in and check-out dates.

#### Booking Management
- Select a room and booking dates.
- Review the reservation details and total amount.
- Create a booking through the backend.
- View booking history, including booking ID, room type, dates, amount, contact details, and status.
- Cancel eligible bookings according to the project's cancellation rules.

#### Responsive User Interface
- Landing-page carousel highlighting rooms.
- About section describing the service.
- Responsive navigation and layouts for desktop and mobile screens.

### Administrator Features

#### Admin Dashboard (`AdminHome`)
The dashboard is described as a tab-based interface with the following sections:

- **All Bookings:** View bookings made by customers.
- **All Rooms:** View room inventory and details.
- **Add Room:** Create room records with type, price, images, and other details.
- **All Users:** View registered users.

#### Admin Authentication
- Log in with administrator credentials.
- Use session/JWT management if configured.
- Display a personalized greeting and logout option.
- Protect admin APIs with server-side role checks.

#### Booking Management
- View all bookings.
- Track active and cancelled bookings.

#### Room Management
- Add new rooms or room categories.
- View existing room details.
- Room editing and deletion can be added if required and implemented safely.

#### User Management
- View registered users.
- Manage roles only through authorized administrative operations.

#### Navigation and UI
- Responsive navigation with logout.
- Tab-based navigation for administrative sections.
- A consistent visual theme and clear status indicators.

## 1.4 Roles and Responsibilities

### Customer / Ordinary User

- Create an account and log in.
- Browse room details and check availability for selected dates.
- Choose a room type and submit a booking.
- Complete payment through the configured payment provider, if payment processing is implemented.
- View reservation history.
- Cancel eligible bookings and view their updated status.

### Administrator

- Manage room inventory and room information.
- Monitor bookings and their status.
- View registered users.
- Support the day-to-day operation of the booking platform.
- Enforce application policies and protect customer information.
- Perform administrative actions only through authenticated and authorized endpoints.

## 1.5 User Flow

### High-level flow

```text
Visitor
└── Home Page
    ├── Login
    │   ├── Customer → UserHome
    │   └── Admin → AdminHome
    └── Sign Up
        └── Login
            ├── Customer → UserHome
            └── Admin → AdminHome

Customer
└── UserHome
    ├── View Rooms
    │   └── Select Dates and Room → Book
    └── My Bookings
        └── Cancel Eligible Booking

Admin
└── AdminHome
    ├── All Bookings
    ├── All Rooms
    ├── Add Room
    └── All Users
```

### 1. Landing / Home Page

**Visible to:** All visitors.

**Features**
- Navigation links for Home, Login, and Sign Up.
- Hero carousel showcasing rooms.
- About section.
- Room preview section.

**User actions**
- Select Login to open the login page.
- Select Sign Up to open the registration page.
- Browse public room previews and information.

### 2. Sign-Up Flow

**Visible to:** New users.

**Fields**
- Name
- Email
- Password
- Confirm password
- Phone
- User type, if role selection is part of the design

**Validation**
- Required fields must be completed.
- Password and confirm-password values must match.
- Email format and uniqueness should be checked.
- Role assignment must be controlled securely; ordinary public users should not be able to self-assign administrator privileges.

**Expected outcome**
- A valid registration request is sent to the backend.
- On success, show a confirmation message and redirect to Login.
- On failure, show a useful error and prevent invalid submission.

The supplied project notes refer to a `/SignUp` endpoint. Confirm the actual route and HTTP method in the source code.

### 3. Login Flow

**Visible to:** Registered users.

**Fields**
- Email
- Password

**Expected outcome**
1. Validate the required fields.
2. Submit credentials to the backend.
3. Verify the credentials securely.
4. On success, establish the session and direct the user to the correct dashboard.
5. On failure, display an appropriate error message.

The notes describe storing a JWT and user information in `localStorage`. If this approach is used, avoid storing sensitive data there and consider the XSS risks. A secure, HTTP-only cookie may be preferable depending on the application's architecture.

### 4. Customer Dashboard (`UserHome`)

**Visible to:** Authenticated customers.

**Features**
- Personalized greeting.
- Navigation to Rooms, My Bookings, and Logout.
- Welcome section and quick booking link.
- Room list populated from the backend.

**Actions**
- Open the room list to browse accommodation.
- Open My Bookings to view reservations.
- Log out to end the session and return to the home page.

### 5. Booking Flow

**Visible to:** Authenticated customers.

**Steps**
1. Browse available rooms.
2. Select check-in and check-out dates.
3. Choose a room or room category.
4. Review the price and reservation details.
5. Submit the booking request.
6. The backend validates availability and calculates the amount.
7. On success, the reservation appears in My Bookings.

Availability and price must be checked on the server, not trusted solely from client-submitted values.

#### Cancel Booking
- Show cancellation controls only for eligible bookings.
- Submit the cancellation request to the backend.
- Verify that the booking belongs to the logged-in customer, unless an authorized administrator is performing the action.
- Update the booking status and availability consistently.

The notes mention a `/cancelbooking` endpoint. Confirm its actual path and method in the code.

### 6. User Bookings Page

**Visible to:** Authenticated customers.

**Booking details**
- Booking ID
- Room type
- Check-in and check-out dates
- Total amount
- Customer contact details, where appropriate
- Booking status, such as Active or Cancelled

Eligible active bookings should provide a cancellation action.

### 7. Admin Dashboard (`AdminHome`)

**Visible to:** Authenticated administrators.

**Sections**
- **All Bookings:** View bookings across the system.
- **All Rooms:** View room inventory.
- **Add Room:** Enter and save new room details.
- **All Users:** View registered users.

**Actions**
- Switch between dashboard sections.
- Perform authorized management actions.
- Log out and return to the home page.

### 8. Logout

**Visible to:** Authenticated customers and administrators.

**Expected action**
- Invalidate or clear the applicable client session/token.
- Clear user-specific client state.
- Redirect to the home page.
- Ensure protected backend routes reject requests without valid authorization.

## 1.6 MVC Pattern

The backend follows the **Model–View–Controller (MVC)** pattern, which separates data access, request handling, and routing. In a REST API, the routing layer takes the role often associated with the View in a traditional MVC application.

### Model Layer

- Defines schemas and data structures.
- Uses Mongoose to interact with MongoDB.
- Represents entities such as users, rooms, and bookings.
- Performs database operations through model methods.

### Controller Layer

- Receives validated request data from routes.
- Applies application/business logic.
- Calls the relevant models.
- Handles expected errors and returns suitable HTTP responses.

### View / Routing Layer

- Defines API endpoints and HTTP methods.
- Maps requests to controller functions.
- Applies middleware such as authentication, authorization, and validation.
- Returns JSON responses to the React client.

### Advantages of MVC

- **Separation of concerns:** Each layer has a clear responsibility.
- **Maintainability:** Changes are easier to isolate.
- **Scalability:** New routes, controllers, and models can be added as requirements grow.
- **Reusability:** Shared model and controller logic can be reused.
- **Testability:** Layers can be tested independently.
- **Team collaboration:** Developers can work on different layers in parallel.

---

# 2. Project Setup and Configuration

## 2.1 Create the Project Folder

1. Create a project folder named `HotelPro`.
2. Open it in Visual Studio Code.
3. Create two directories inside it: `client` and `server`.

Expected structure:

```text
HotelPro/
├── client/
└── server/
```

## 2.2 Client Setup (React + Vite)

Open a terminal in the `client` directory.

Create a React application with Vite:

```bash
npm create vite@latest . -- --template react
```

If prompted, select **React** and **JavaScript**.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite prints the local URL in the terminal, commonly `http://localhost:5173`.

### Client responsibilities

- Render pages and components.
- Handle form input and client-side validation.
- Call backend APIs.
- Display room information and booking status.
- Provide customer and administrator dashboards.
- Show loading, success, and error states.

## 2.3 Server Setup (Node.js + Express)

Open a separate terminal in the `server` directory.

Initialize the Node.js project:

```bash
npm init -y
```

Create the initial file and directories:

```text
server/
├── server.js
├── models/
├── controllers/
├── routes/
└── package.json
```

Install the packages required by the implementation. A typical Express/MongoDB setup may use:

```bash
npm install express mongoose cors dotenv
npm install bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

Only install packages that the source code actually uses. Configure the `package.json` scripts as appropriate; for example:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Start the server with:

```bash
npm run dev
```

### Suggested server responsibilities

- Configure Express and middleware.
- Connect to MongoDB.
- Register API routes.
- Validate and authenticate requests.
- Enforce customer/admin authorization.
- Run booking and room-availability checks.
- Return consistent JSON responses.

## 2.4 Environment Configuration

Keep secrets and environment-specific settings out of source control. A server-side `.env` file may contain values such as:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Add `.env` to `.gitignore`. Do not commit database credentials, JWT secrets, payment credentials, or other private keys. Use a separate client environment variable for the API base URL if needed, and never expose server secrets through client-side variables.

## 2.5 Running the Application

Run the backend and frontend in separate terminals:

**Terminal 1 — Server**

```bash
cd server
npm run dev
```

**Terminal 2 — Client**

```bash
cd client
npm run dev
```

Open the local client URL printed by Vite. Confirm that the frontend API base URL, backend port, CORS configuration, and database connection match your local setup.

---

# 3. Suggested API Areas

The exact endpoints must match the project's implementation. The following is a planning checklist, not a claim that all routes already exist.

| Area | Typical operations |
|---|---|
| Authentication | Register, log in, log out/session handling |
| Rooms | List rooms, retrieve room details, create room, update/delete room if supported |
| Availability | Search rooms by check-in and check-out dates |
| Bookings | Create booking, list current user's bookings, list all bookings for admins |
| Cancellation | Cancel an eligible booking |
| Users | Retrieve users for authorized administration |
| Payments | Create/verify payment through a payment provider, if supported |

For every protected endpoint, enforce authentication and role authorization on the server. Never rely only on hiding a button or dashboard tab in React.

---

# 4. Data and Security Considerations

- Hash passwords with a suitable password-hashing library before storing them.
- Do not persist confirm-password values after registration validation.
- Never store CVV values. Use a payment provider rather than storing raw payment-card data.
- Validate all inputs on the server, even if the client also validates them.
- Check room availability and calculate the final price on the server.
- Prevent duplicate or overlapping reservations using consistent booking rules and suitable database operations.
- Restrict admin operations with server-side role checks.
- Avoid returning password hashes, payment secrets, or unnecessary personal data in API responses.
- Keep environment variables and credentials out of version control.
- Provide meaningful error responses without exposing internal stack traces in production.

---

# 5. Testing Checklist

- [ ] A visitor can open the home page.
- [ ] Registration validates required fields and matching passwords.
- [ ] Duplicate email registration is handled.
- [ ] Valid users can log in and reach the appropriate dashboard.
- [ ] Invalid credentials are rejected.
- [ ] Customers can browse room details.
- [ ] Availability is checked for the selected dates.
- [ ] A valid booking is saved and appears in booking history.
- [ ] Customers cannot cancel another customer's booking.
- [ ] Cancellation updates the booking status correctly.
- [ ] Admin-only endpoints reject ordinary customers.
- [ ] Admins can view bookings, rooms, and users.
- [ ] Admins can add rooms if that feature is implemented.
- [ ] Logout clears the active client session.
- [ ] The application handles database or network errors gracefully.
- [ ] Sensitive information is not returned in API responses.

---

# 6. Conclusion

HotelPro provides a foundation for a hotel room booking and management application. Its proposed architecture separates the React user interface from the Node.js/Express API and MongoDB data layer. Customer workflows cover authentication, room discovery, booking, and cancellation, while administrator workflows support room, booking, and user oversight.

The project can be extended with secure payment integration, improved availability checks, reporting, notifications, and additional room-management operations as needed.
---

# 3. Backend Development

## 3.1 Backend Structure

The backend handles API requests, authentication, business logic, and database operations. The supplied project screenshots show a Node.js backend using Express and Mongoose, with separate model and route files.

### Backend dependencies

The project may use the following packages, as shown in the supplied setup notes and screenshots:

- **Express** — Creates the HTTP server and defines API routes.
- **Mongoose** — Defines MongoDB schemas and communicates with MongoDB.
- **CORS** — Configures which frontend origins can access the backend.
- **bcrypt / bcryptjs** — Hashes passwords before storage and verifies passwords during login.
- **dotenv** — Loads environment variables from a `.env` file.
- **Multer** — Handles file uploads, if room or media image uploads are supported.
- **Nodemon** — Restarts the development server when files change.
- **jsonwebtoken** — Creates and verifies JSON Web Tokens (JWTs) for authentication.
- **body-parser** — Parses request bodies where explicitly used. Express also provides `express.json()`.
- **Axios** — Used on the frontend to send HTTP requests to the backend.

Install only the packages required by the actual codebase. For example:

```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

If the application uses uploads or other integrations, install their required packages as well.

### Backend folder structure

The supplied screenshots show a backend organized around middleware, models, routes, utilities, environment configuration, and a server entry point. A representative structure is:

```text
backend/
├── middlewares/
│   └── fetchUser.js
├── models/
│   ├── userModel.js
│   ├── adminModel.js
│   ├── roomModel.js
│   └── bookingModel.js
├── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── bookingRoutes.js
│   └── roomRoutes.js
├── utils/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

The screenshots also include model and route files for movies, shows, theatres, favorites, and reviews. Those names appear to belong to a different or reused project structure; keep only the modules relevant to the HotelPro hotel-booking application. Likewise, route imports in `server.js` must match files that actually exist.

## 3.2 Backend Development and Explanation

### 3.2.1 Set Up the Express Server

Create the server entry file (for example, `server.js` or `index.js`) in the backend directory. The project should use one clearly configured entry point.

Typical server responsibilities include:

1. Import Express and other required dependencies.
2. Create an Express application instance.
3. Configure JSON-body parsing and CORS.
4. Load environment variables.
5. Connect to MongoDB.
6. Register authentication, room, booking, and admin routes.
7. Start listening on the configured port after the database connection succeeds.

Example outline:

```javascript
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Mount route modules here, for example:
// app.use("/api/auth", authRoutes);
// app.use("/api/rooms", roomRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

This is a general example, not a replacement for the project's actual server file. Add each route import only after confirming that the corresponding file exists and exports an Express router.

### 3.2.2 Configure MongoDB

- Import Mongoose.
- Read the MongoDB connection string from a server-side environment variable.
- Connect before handling database-dependent operations.
- Log a successful connection and handle connection errors.
- Define database schemas and models in the `models/` directory.

The screenshots show both a hard-coded local URI and an environment-variable-based URI. Prefer the environment-variable approach so credentials and environment-specific settings are not embedded in source code.

### 3.2.3 Add Authentication

The user model stores account details. Registration and login routes should:

1. Validate the incoming fields.
2. Check whether the email is already registered.
3. Hash the password with bcrypt/bcryptjs before storing it.
4. Verify the submitted password against the stored hash during login.
5. Issue a JWT or establish another secure session after successful authentication.
6. Verify the token in middleware before allowing access to protected routes.
7. Check the user's role on administrator-only routes.

The supplied registration screenshot uses a `SignUp` route, checks for an existing email, hashes the password with bcrypt, and creates a user record. Ensure that field names in the request body match the schema. For example, if the schema uses `userType`, the frontend and backend should consistently use that name.

**Important:** Never allow a public registration form to grant administrator privileges without a secure administrative process. Passwords must not be stored as plain text, and sensitive user data must not be returned in API responses.

### 3.2.4 Add Room

Create a room model and an authorized room-creation endpoint. The screenshot shows a flow similar to:

```javascript
const newRoom = new roomModel(req.body);
const room = await newRoom.save();
res.send(room);
```

Before using this pattern in production, validate and whitelist the fields accepted from `req.body`, require administrator authorization, and return appropriate status codes. Avoid saving arbitrary client-supplied fields directly.

The room model shown in the supplied screenshots includes room number, count, rent, type, photos, description, and current-booking information.

---

# 4. Database Development

## 4.1 Configure MongoDB

MongoDB stores application data in collections. Mongoose provides the schema and model layer used by the Node.js backend.

Basic configuration steps:

1. Install and run MongoDB locally or create a database through a managed MongoDB provider.
2. Install Mongoose in the backend project:

   ```bash
   npm install mongoose
   ```

3. Put the connection URI in the server's `.env` file.
4. Create Mongoose schemas and models for users, rooms, and bookings.
5. Connect to the database before serving requests that require database access.

Example `.env` entry:

```env
MONGODB_CONNECTION_LINK=mongodb://127.0.0.1:27017/Roomly
```

The database name in this example is `Roomly`, as specified in the supplied notes. The project may use another database name depending on its configuration.

## 4.2 Create the Database Connection

The supplied connection screenshot reads a MongoDB URI from `process.env.MONGODB_CONNECTION_LINK` and calls `mongoose.connect()`.

Example:

```javascript
require("dotenv").config();
const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_CONNECTION_LINK;

async function connectToMongo() {
  if (!mongoUri) {
    throw new Error("MONGODB_CONNECTION_LINK is not configured");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

module.exports = connectToMongo;
```

Call and await `connectToMongo()` before starting the HTTP server. This avoids accepting database-dependent requests before the initial connection is ready.

### Explanation of the connection URI

Example:

```text
mongodb://127.0.0.1:27017/Roomly
```

- **`mongodb://`** — The MongoDB connection protocol.
- **`127.0.0.1`** — The local machine, when MongoDB is running on the same computer.
- **`27017`** — MongoDB's default port.
- **`Roomly`** — The database name.

MongoDB can create the database when data is first written, depending on the deployment and operation.

### Connection success and failure

- On success, `mongoose.connect()` resolves and the application can log a confirmation.
- On failure, the error should be logged and handled appropriately.
- Mongoose versions using current MongoDB drivers generally do not require the older `useNewUrlParser` and `useUnifiedTopology` options shown in older tutorials. Follow the options supported by the installed version.

## 4.3 Create Schemas and Models

A schema defines the fields and validation rules for a document. A model provides methods for creating, reading, updating, and deleting documents in a MongoDB collection.

### 4.3.1 User Model

The supplied screenshots show a user model with fields such as name, email, password, phone, and user type. One screenshot also includes number, gender, age, and role, suggesting a schema from a separate or earlier implementation. Use one consistent schema that matches the HotelPro registration form and API.

Example:

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    userType: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
```

The schema above is an illustrative example. Adjust field names and permitted roles to match the actual project. Role assignment must be controlled by trusted backend logic.

### 4.3.2 Room Model

The supplied room-model screenshot shows `roomNumber`, `count`, `rent`, `type`, `photos`, `description`, and `currentbooking`.

Example:

```javascript
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: Number, required: true },
    count: { type: Number, required: true, min: 0 },
    rent: { type: Number, required: true, min: 0 },
    type: { type: String, required: true },
    photos: [{ type: String }],
    description: { type: String, required: true },
    currentBookings: [
      {
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking"
        },
        fromdate: Date,
        todate: Date,
        status: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
```

This example uses `currentBookings` consistently. If the actual application uses `currentbooking`, either retain that exact name everywhere or migrate it carefully. Do not mix different spellings across the model and controllers.

### 4.3.3 Booking Model

The supplied booking-model screenshot includes a reference to a room, an optional user reference, username, dates, amount, total days, phone, card details, and status.

Example of a safer booking structure:

```javascript
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    username: { type: String, required: true },
    fromdate: { type: Date, required: true },
    todate: { type: Date, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    totalDays: { type: Number, required: true, min: 1 },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked"
    },
    paymentReference: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
```

This is an example schema; field names and status values must match the real routes and frontend. Calculate the number of days and amount on the server, and validate that the checkout date is after check-in.

**Payment security:** The supplied screenshot includes cardholder name, card number, CVV, and expiry date in a nested `cardDetails` object. Do not persist the raw card number or CVV in MongoDB. Integrate a payment provider and store a payment reference or token plus only the permitted metadata required by the provider.

---

# 5. Frontend Development

## 5.1 Frontend Structure

The frontend is built with React and Vite, with React Router for navigation and Axios for API requests. A representative structure is:

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── user/
│   │   │   ├── UserHome.jsx
│   │   │   ├── BookingHistory.jsx
│   │   │   └── BookingStatus.jsx
│   │   └── admin/
│   │       └── AdminHome.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

This is a suggested structure. The actual component names and folder arrangement may differ.

## 5.2 Development and Explanation

### 5.2.1 Install Frontend Tools

The supplied screenshots show React, Vite, Axios, React Router, Bootstrap-related packages, charting libraries, icons, and other UI packages.

Create a React application using Vite:

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

Install routing and API packages:

```bash
npm install react-router-dom axios
```

Choose a styling library that matches the project:

```bash
npm install bootstrap react-bootstrap
```

Other libraries such as Material UI, Ant Design, MDB React UI Kit, Font Awesome, React Icons, Sass, or charting tools can be installed if the components actually use them. Avoid installing several overlapping UI frameworks without a clear reason.

### 5.2.2 Design UI Components

Build reusable components, for example:

- Header / Navbar
- Footer
- Sidebar
- Login form
- Registration form
- Room cards and room list
- Booking history
- Customer dashboard
- Administrator dashboard
- Protected route wrapper

Use responsive layouts with CSS Grid or Flexbox. Keep navigation, forms, loading indicators, and error messages consistent across the application.

### 5.2.3 Configure Navigation with React Router

Install React Router if it is not already installed:

```bash
npm install react-router-dom
```

Define routes for the home page, login, registration, customer pages, and admin pages. Example route names might include `/`, `/login`, `/register`, `/rooms`, `/bookings`, and `/admin`; use the paths defined by the actual project.

A route should render the appropriate component. Protected routes should check authentication and, where applicable, the user's role.

### 5.2.4 Connect the Frontend to the Backend with Axios

Axios sends HTTP requests from React components to the Express API.

Example:

```javascript
import axios from "axios";

const response = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
  { email, password }
);
```

Define the base URL in the frontend environment file if needed:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The example endpoint and port must be adjusted to match the backend. Vite exposes variables prefixed with `VITE_` to client code, so never place database credentials or server-side secrets in them.

When using Axios, handle loading states, success responses, validation errors, and network failures. Keep API paths and request field names consistent with the Express routes.

### 5.2.5 Authentication State and Protected Routes

The supplied frontend screenshot checks for a user in `localStorage` and wraps a home route in a `ProtectedRoute` component. A protected route generally:

1. Checks whether the user has a valid session.
2. Redirects unauthenticated users to Login.
3. Checks roles before displaying customer- or admin-only pages.
4. Allows access only when the required conditions are satisfied.

A client-side route guard improves navigation but is not a security boundary. The backend must verify the token and permissions for every protected API request.

If JWTs are stored in `localStorage`, recognize that JavaScript running on the page can access them. Consider secure HTTP-only cookies and appropriate CSRF protections for a production application. Never put passwords or payment-card secrets in client storage.

---

# 6. Configuration Consistency Notes

The supplied screenshots appear to contain snippets from more than one application or project revision. Before using the code, reconcile these differences:

- **Project identity:** The documentation describes HotelPro, while the backend tree also contains movie, show, theatre, favorite, and review modules. Confirm which modules belong to the current application.
- **Server entry point:** One screenshot shows `server.js`, while the notes mention `index.js`. Use the file named in `package.json` and keep the startup script consistent with it.
- **Route imports:** The shown server imports `reportRoute` and `userRoute`, but those names are not present in the displayed route tree. Confirm the real filenames and exports before mounting routes.
- **Port:** The screenshot shows port `8000`. Ensure the frontend API base URL and CORS configuration use the same backend port.
- **MongoDB URI:** One screenshot hard-codes a local database named `DARK`; another uses `MONGODB_CONNECTION_LINK` and the `Roomly` database. Prefer the `.env` variable and choose the correct database name for this project.
- **User schema fields:** The screenshots show different field names, including `number` versus `phone`, `role` versus `userType`, and different sets of fields. Standardize names across the schema, registration route, login route, and React forms.
- **Room field names:** Keep `currentBookings`/`currentbooking` consistent throughout the application.
- **Booking field names:** Keep `roomId`/`roomid`, `userId`/`userid`, `totalDays`/`totaldays`, and date-field naming consistent.
- **Payment details:** Do not store raw card numbers or CVV values; use a payment provider.
- **JWT verification:** Ensure the token middleware verifies signatures and expiry, and ensure admin authorization is enforced by the backend.
- **Package scripts:** The screenshot uses `nodemon server.js` as the start command. A typical setup uses `node server.js` for production and `nodemon server.js` for development.

---

# 7. Conclusion

The backend and frontend work together to provide HotelPro's room browsing, authentication, booking, and administration workflows. The backend uses Express routes, controllers or route handlers, Mongoose models, and MongoDB. The React frontend uses reusable components, React Router, and Axios to interact with the API.

For a reliable implementation, keep route names and schema fields consistent, establish the database connection before accepting requests, validate booking data on the server, protect administrative operations, and use secure payment handling.
---

# 8. Project Execution

## 8.1 Steps for Project Execution

This section describes how to run the HotelPro frontend and backend locally, based on the supplied project-execution screenshot.

### Step 1: Set Up the Frontend (React App)

1. Open a terminal in the project root.
2. Navigate into the client folder:

   ```bash
   cd client
   ```

3. Install the frontend dependencies if this has not already been done:

   ```bash
   npm install
   ```

4. Start the React development server:

   ```bash
   npm run dev
   ```

5. Vite should display a local development URL, commonly:

   ```text
   http://localhost:5173
   ```

Open the URL shown in the terminal to access the frontend.

### Step 2: Set Up the Backend (Express Server)

1. Open a second terminal tab/window, or split the terminal in VS Code.
2. Navigate into the backend folder. If the folder is named `server` and you are in the `client` directory, use:

   ```bash
   cd ../server
   ```

   If your backend folder is named `backend`, navigate to that folder instead. Use the actual folder name in your project.

3. Install backend dependencies if needed:

   ```bash
   npm install
   ```

### Step 3: Configure Environment Variables

1. Inside the backend folder, create a file named `.env` (with no extra file extension).
2. Add the MongoDB connection string. The supplied execution screenshot shows:

   ```env
   MONGO_URI=mongodb://localhost:27017/hotel
   ```

3. Make sure the backend code reads the same variable name. For example, if the code uses `process.env.MONGODB_CONNECTION_LINK`, either update the `.env` key to `MONGODB_CONNECTION_LINK` or update the code to use `MONGO_URI`. The environment-variable name must match exactly.
4. Ensure MongoDB is running locally, or replace the URI with the connection string for your configured database.
5. Keep `.env` out of version control and never commit database credentials or other secrets.

### Step 4: Start the Backend Server

Use the startup command that matches the backend's `package.json` and entry-point filename.

For a backend configured with an `index.js` entry point:

```bash
npx nodemon index.js
```

For a backend configured with a `server.js` entry point:

```bash
npm run dev
```

The supplied screenshot shows the backend running at:

```text
http://localhost:8001
```

However, the actual port is determined by the server code or its environment configuration. If the code uses port `8000`, for example, update the frontend API base URL accordingly. The frontend and backend must agree on the configured port.

## 8.2 Execution Checklist

- [ ] Install frontend dependencies with `npm install` in the client directory.
- [ ] Install backend dependencies with `npm install` in the backend directory.
- [ ] Configure the correct MongoDB URI in `.env`.
- [ ] Confirm that the environment-variable name matches the backend code.
- [ ] Confirm MongoDB is running and the backend connects successfully.
- [ ] Start the backend using the correct entry point and port.
- [ ] Start the frontend using `npm run dev`.
- [ ] Open the Vite URL printed in the terminal.
- [ ] Verify that frontend API requests point to the correct backend URL.
- [ ] Test registration, login, room browsing, booking, cancellation, and administrator functions as implemented.

## 8.3 Troubleshooting

| Issue | What to check |
|---|---|
| Frontend does not start | Run `npm install` in `client`, then `npm run dev`; check terminal errors. |
| Backend does not start | Confirm the correct folder, installed dependencies, entry-point filename, and `package.json` script. |
| MongoDB connection fails | Confirm MongoDB is running and the URI and database name are correct. |
| Environment variable is undefined | Ensure `.env` is in the backend directory, `dotenv` is loaded, and the variable name matches the code. |
| Frontend cannot reach the backend | Check the backend port, frontend API base URL, CORS configuration, and whether both servers are running. |
| API route returns 404 | Confirm that the route exists and is mounted under the expected path in the server entry point. |


Conclusion : Roomly offers a comprehensive solution to optimize hotel operations. With its secure, scalable backend and user-friendly interfaces, it simplifies booking, guest management, and payment processing. By enhancing efficiency and ensuring robust authentication, it provides a seamless experience for both staff and guests, ultimately improving productivity and customer satisfaction.