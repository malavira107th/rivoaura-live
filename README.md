# Rivoaura Live

**Host your own cricket watch party with live audio and chat rooms.**

Rivoaura Live is a community platform that lets cricket fans create and join watch parties with built-in live audio communication and real-time chat. Set the capacity, invite your crew, and experience every match together.

---

## 🚀 Features

- **Host Watch Parties** - Create private or public watch parties for any cricket match
- **Live Audio Rooms** - Built-in WebRTC audio communication for real-time discussion
- **Real-time Chat** - Text chat with emoji reactions and system notifications
- **Host Moderation** - Kick users, mute participants, and manage your room
- **Event Management** - Browse upcoming parties, join waitlists, and manage registrations
- **User Profiles** - Track your hosted parties and joined events
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- tRPC for type-safe API calls
- Wouter for routing
- Socket.IO for real-time features
- Framer Motion for animations

**Backend:**
- Node.js with Express
- tRPC server
- WebSocket (Socket.IO) for real-time communication
- Drizzle ORM for database
- MySQL/TiDB database
- JWT authentication

**Infrastructure:**
- CloudFront CDN for assets
- S3 for file storage
- OAuth authentication

---

## 📋 Prerequisites

- Node.js 22.x or higher
- pnpm package manager
- MySQL database (or TiDB)
- OAuth provider credentials

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/malavira107th/rivoaura-live.git
cd rivoaura-live
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-jwt-secret-here
OAUTH_SERVER_URL=https://your-oauth-server.com
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.com
VITE_APP_ID=your-app-id

# Owner Information
OWNER_OPEN_ID=owner-open-id
OWNER_NAME=Owner Name

# API Services
BUILT_IN_FORGE_API_URL=https://your-api-url.com
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key
VITE_FRONTEND_FORGE_API_URL=https://your-frontend-api-url.com

# App Branding
VITE_APP_TITLE=Rivoaura Live
VITE_APP_LOGO=https://your-cdn.com/logo.webp

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=https://your-analytics-endpoint.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### 4. Set up the database

```bash
pnpm db:push
```

This will:
- Generate database migrations from your schema
- Apply migrations to your database

### 5. Run the development server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

---

## 🚀 Deployment

### Option 1: Deploy to Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add all environment variables from `.env`
4. Railway will automatically detect and deploy your app

### Option 2: Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command: `pnpm install && pnpm build`
4. Set start command: `node dist/index.js`
5. Add all environment variables
6. Deploy

### Option 3: Deploy to Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
1. Import your repository to [Vercel](https://vercel.com)
2. Set framework preset to "Vite"
3. Add frontend environment variables (VITE_* variables)
4. Deploy

**Backend (Railway):**
1. Create a new project on Railway
2. Deploy the backend separately
3. Update frontend API URL to point to Railway backend

### Build Commands

```bash
# Build for production
pnpm build

# Run production server
node dist/index.js

# Run tests
pnpm test
```

---

## 📁 Project Structure

```
rivoaura-live/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and data
│   │   └── _core/         # Core hooks and utilities
│   └── index.html
├── server/                # Backend Express + tRPC server
│   ├── _core/            # Core server infrastructure
│   ├── routers.ts        # tRPC API routes
│   ├── db.ts             # Database queries
│   ├── socket.ts         # WebSocket handlers
│   └── storage.ts        # S3 storage helpers
├── drizzle/              # Database schema and migrations
│   ├── schema.ts         # Database tables
│   └── migrations/       # Migration files
├── shared/               # Shared types and constants
└── package.json
```

---

## 🔑 Key Files

- `server/routers.ts` - Define your tRPC API endpoints
- `server/socket.ts` - WebSocket event handlers for real-time features
- `drizzle/schema.ts` - Database schema definitions
- `client/src/App.tsx` - Frontend routing and layout
- `client/src/lib/data.ts` - Site configuration and constants

---

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Tests include:
- tRPC API endpoint tests
- WebSocket event handler tests
- Authentication flow tests
- Database query tests

---

## 🔒 Security Notes

- Never commit `.env` files to version control
- Rotate OAuth tokens and API keys regularly
- Use strong JWT secrets in production
- Enable HTTPS in production deployments
- Implement rate limiting for API endpoints

---

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Yes |
| `OAUTH_SERVER_URL` | OAuth authentication server URL | Yes |
| `VITE_OAUTH_PORTAL_URL` | OAuth login portal URL | Yes |
| `VITE_APP_ID` | Application ID for OAuth | Yes |
| `OWNER_OPEN_ID` | Platform owner's OpenID | Yes |
| `OWNER_NAME` | Platform owner's display name | Yes |
| `BUILT_IN_FORGE_API_URL` | Backend API services URL | Yes |
| `BUILT_IN_FORGE_API_KEY` | Backend API authentication key | Yes |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend API authentication key | Yes |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend API services URL | Yes |
| `VITE_APP_TITLE` | Application title | No |
| `VITE_APP_LOGO` | Application logo URL | No |
| `VITE_ANALYTICS_ENDPOINT` | Analytics service endpoint | No |
| `VITE_ANALYTICS_WEBSITE_ID` | Analytics website identifier | No |

---

## 📄 License

Copyright © 2026 RIVOAURA PRIVATE LIMITED  
CIN: U74999DL2016PTC306805

All rights reserved.

---

## 🏢 Company Information

**RIVOAURA PRIVATE LIMITED**  
Ground Floor, A 96, Shankar Garden, Vikas Puri  
New Delhi, West Delhi, Delhi, 110018  
India

CIN: U74999DL2016PTC306805

---

## 📞 Support

For support, contact: support@rivoauralive.com

---

## 🌐 Links

- **Website:** https://rivoauralive.com
- **GitHub:** https://github.com/malavira107th/rivoaura-live

---

Built with ❤️ for cricket fans worldwide
