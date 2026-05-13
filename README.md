# Nexus — Modern Community Platform

Nexus is a full-stack community platform inspired by Reddit, LinkedIn, and Stack Overflow. Built as a 2-week MVP project.

## 🌐 Live Demo
[View Live Site](https://nexus-app12.vercel.app/)

## ✨ Features
- 🔐 User authentication (Clerk)
- 👤 User profiles with bio
- 🏘️ Create and browse communities
- 📝 Create posts with tags
- ⬆️ Upvote and downvote posts
- 💬 Comment on posts
- 🔍 Search posts and communities
- 🔖 Bookmark posts
- 🗑️ Delete your own posts and comments
- 📊 Sort by Latest or Most Popular

## 🛠️ Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma
- **Authentication:** Clerk
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Clerk account

### Installation
1. Clone the repository
```bash
   git clone https://github.com/YOUR_USERNAME/reddit-clone.git
```

2. Install dependencies
```bash
   npm install
```

3. Set up environment variables
```bash
   cp .env.example .env.local
```

4. Push database schema
```bash
   npx prisma db push
```

5. Run the development server
```bash
   npm run dev
```

## 📱 Screenshots
Coming soon!

## 🔮 Future Enhancements
- Nested comments
- Real-time notifications
- Community moderation tools
- Mobile app