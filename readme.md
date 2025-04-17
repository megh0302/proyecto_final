# Cinema Reservations

A web application for managing cinema seat reservations.

## Setup

### Backend
1. Navigate to `/backend`.
2. Run `npm install`.
3. Create a `.env` file with the required variables.
4. Execute the SQL script: `mysql -u root -p < init.sql`.
5. Start the server: `npm run dev`.

### Frontend
1. Navigate to `/frontend`.
2. Run `npm install`.
3. Create a `.env.local` file with `REACT_APP_API_URL`.
4. Start the app: `npm start`.

## Endpoints
- `POST /api/auth/login`: Login user.
- `POST /api/rooms`: Create room (admin).

## Technologies
- Backend: Node.js, Express, MySQL, JWT
- Frontend: React, Material UI