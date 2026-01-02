# ATK-DEF CTF Frontend

A modern, cyberpunk-themed Attack-Defense CTF Platform frontend built with React 18 + Vite + TypeScript + Tailwind CSS + shadcn-ui.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend API running at `http://localhost:8080/api`

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: shadcn-ui (Radix primitives)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Tables**: TanStack Table
- **Notifications**: Sonner

## 🎨 Design Theme

Cyberpunk/Terminal aesthetic with:
- Dark mode primary with neon accents (Cyan, Magenta, Yellow)
- Glassmorphism effects
- Neon glow borders
- Custom fonts: Orbitron (headings), JetBrains Mono (code), Inter (body)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn-ui components
│   ├── layout/          # Layout components
│   ├── auth/            # Authentication components
│   ├── team/            # Team management components
│   ├── scoreboard/      # Scoreboard components
│   ├── game/            # Game control components
│   └── dashboard/       # Dashboard components
├── pages/
│   ├── public/          # Public pages (login, signup, scoreboard)
│   ├── team/            # Team pages (dashboard, profile)
│   ├── admin/           # Admin pages (team mgmt, game control)
│   └── error/           # Error pages (404, 403)
├── services/            # API services
├── stores/              # Zustand stores
├── hooks/               # Custom hooks
├── types/               # TypeScript interfaces
├── lib/                 # Utilities
└── utils/               # Helper functions
```

## 🔑 User Roles

- **TEAM**: Student teams participating in CTF
- **TEACHER**: Can manage teams and control game
- **ADMIN**: Full system access

## 📡 API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - Team registration
- `GET /api/auth/me` - Get current user
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team (Admin/Teacher)
- `GET /api/scoreboard` - Live scoreboard
- `POST /api/game/start` - Start game (Admin/Teacher)
- `POST /api/game/stop` - Stop game (Admin/Teacher)
- `POST /api/upload/checker` - Upload checker script
- `POST /api/upload/vulnbox` - Upload vulnbox

## 🔧 Configuration

Edit `.env` file to configure:

- `VITE_API_URL`: Backend API base URL (default: `http://localhost:8080/api`)

## 📝 License

MIT
