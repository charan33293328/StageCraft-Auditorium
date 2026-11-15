# StageCraft Auditorium

A sound equipment management system built using **Node.js, Express.js, and SQLite** for managing technicians, speakers, and bookings with a controlled booking status workflow.

## 1. Project Overview

StageCraft Auditorium is a backend application designed to manage auditorium sound equipment and booking operations.

The system provides RESTful APIs to:
- Manage technicians.
- Manage speakers and their equipment types.
- Create, retrieve, update, and delete bookings.
- Retrieve booking information using SQL JOIN operations.
- Control booking status through a sequential workflow.
- Validate user input and handle errors appropriately.

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend web framework |
| SQLite | Relational database |
| SQLite3 | Database connectivity |
| Postman | API testing |
| Git and GitHub | Version control and collaboration |

## 3. Project Structure

```text
StageCraft-Auditorium/
│
├── config/
│   └── database.js
│
├── controllers/
│   ├── technicianController.js
│   ├── speakerController.js
│   └── bookingController.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── routes/
│   ├── technicianRoutes.js
│   ├── speakerRoutes.js
│   └── bookingRoutes.js
│
├── postman/
│   └── StageCraft.postman_collection.json
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## 4. Installation and Setup

### Prerequisites

- Node.js
- npm
- Git
- Postman

### Clone the Repository

```bash
git clone https://github.com/charan33293328/StageCraft-Auditorium.git
```

Navigate into the project directory:

```bash
cd StageCraft-Auditorium
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

To check whether the API is running:

```http
GET /
```

Expected response:

```json
{
  "message": "StageCraft Auditorium API is running"
}
```

## 5. Database Design

The application uses SQLite with three related tables.

### Technicians

Stores technician information.

| Column | Description |
|---|---|
| id | Primary key |
| name | Technician name |
| email | Unique email address |
| phone | Contact number |

### Speakers

Stores auditorium sound equipment information.

| Column | Description |
|---|---|
| id | Primary key |
| name | Speaker name |
| type | Speaker type |

### Bookings

Stores booking information and relationships.

| Column | Description |
|---|---|
| id | Primary key |
| technician_id | Foreign key referencing technicians |
| speaker_id | Foreign key referencing speakers |
| booking_date | Booking date |
| status | Booking status, default pending |

### Database Relationships

- One technician can be associated with multiple bookings.
- One speaker can be associated with multiple bookings.
- Each booking references one technician and one speaker.

## 6. API Documentation

Base URL:

```text
http://localhost:3000
```

### A. Technician APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/technicians` | Get all technicians |
| GET | `/technicians/:id` | Get technician by ID |
| POST | `/technicians` | Create technician |
| PUT | `/technicians/:id` | Update technician |
| DELETE | `/technicians/:id` | Delete technician |

Example POST request:

```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "phone": "9876543210"
}
```

### B. Speaker APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/speakers` | Get all speakers |
| GET | `/speakers/:id` | Get speaker by ID |
| POST | `/speakers` | Create speaker |
| PUT | `/speakers/:id` | Update speaker |
| DELETE | `/speakers/:id` | Delete speaker |

Speaker search:

```http
GET /speakers?type=Portable
```

Example POST request:

```json
{
  "name": "JBL EON615",
  "type": "Powered"
}
```

### C. Booking APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/bookings` | Create booking |
| GET | `/bookings` | Get all bookings with JOIN |
| GET | `/bookings/:id` | Get booking by ID with JOIN |
| PUT | `/bookings/:id` | Update booking details |
| DELETE | `/bookings/:id` | Delete booking |
| PATCH | `/bookings/:id/status` | Update booking status |

Example booking creation:

```json
{
  "technician_id": 1,
  "speaker_id": 1,
  "booking_date": "2026-11-20"
}
```

New bookings automatically receive the `pending` status.

### SQL JOIN Implementation

The booking retrieval APIs use SQL JOIN operations to retrieve:

- Booking details.
- Technician names.
- Speaker names.

This avoids returning only foreign-key IDs and provides meaningful booking information.

## 7. Booking Status Workflow

The booking status follows a sequential transition system.

### Valid Transitions

```text
pending → approved → done
```

| Current Status | New Status | Result |
|---|---|---|
| pending | approved | Allowed |
| approved | done | Allowed |
| pending | done | Rejected |
| approved | pending | Rejected |
| done | approved | Rejected |

### PATCH Request Example

Endpoint:

```http
PATCH /bookings/1/status
```

Request body:

```json
{
  "status": "approved"
}
```

Successful response:

```json
{
  "message": "Booking status updated successfully",
  "status": "approved"
}
```

### Invalid Transition Response

For an invalid status transition, the API returns:

**HTTP 400 Bad Request**

```json
{
  "error": "Invalid status change"
}
```

The database status remains unchanged when a transition is rejected.

## 8. Validation and Error Handling

The application implements input validation and appropriate HTTP status codes.

| HTTP Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid input or status transition |
| 404 | Resource not found |
| 409 | Resource conflict |
| 500 | Internal server error |

Examples of validation:
- Required fields must be provided.
- Technician and speaker IDs must reference valid records.
- Duplicate technician email addresses are rejected.
- Speakers associated with existing bookings cannot be deleted.
- Invalid booking status transitions are rejected.

## 9. Postman API Testing

The Postman collection is available at:

```text
postman/StageCraft.postman_collection.json
```

### Import Instructions

1. Open Postman.
2. Select Import.
3. Choose the collection JSON file.
4. Import the collection.
5. Set `baseUrl` to `http://localhost:3000`.
6. Execute the requests.

The collection contains four groups:

1. Technician APIs.
2. Speaker APIs.
3. Booking CRUD and JOIN APIs.
4. Booking Status Workflow.

It includes request examples and automated response assertions.

## 10. Testing Results

The following core operations were tested using Postman:

| Test Case | Expected Result |
|---|---|
| Create booking | 201 Created |
| Retrieve all bookings with JOIN | 200 OK |
| Retrieve booking by ID | 200 OK |
| Update booking | 200 OK |
| Delete booking | 200 OK |
| Retrieve nonexistent booking | 404 Not Found |
| Missing booking fields | 400 Bad Request |
| Invalid foreign keys | 400 Bad Request |
| pending → approved | 200 OK |
| approved → done | 200 OK |
| done → approved | 400 Bad Request |
| pending → done | 400 Bad Request |

## 11. Group 10 – Team Contributions

| Member | Responsibility |
|---|---|
| S. Balaji Naydu | Express server setup and technician CRUD APIs |
| S. Rakesh Reddy | SQLite database, schema, relationships, and seed data |
| L. Charan Teja | Speaker CRUD APIs, validation, and search |
| S. Yuvaraja Reddy | Booking CRUD APIs and SQL JOIN implementation |
| T. Neeraj Kumar Reddy | Booking status workflow, Postman collection, and README documentation |

**Group:** LG10
**Class & Section:** CSE(QE) - 2B S-13 204

## 12. Repository

GitHub Repository:

https://github.com/charan33293328/StageCraft-Auditorium

---

**StageCraft Auditorium – Sound Equipment Management System**

Developed as a group project using Node.js, Express.js, and SQLite.