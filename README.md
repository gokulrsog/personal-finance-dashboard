# Finance Tracker - Full Stack Web Application

## Overview

A modern, professional personal finance management application built with Next.js, Prisma, and AI-powered insights. The application provides comprehensive financial management features with a beautiful, responsive user interface.

## ✅ Completed Features

### 🎨 Frontend
- **Modern Dashboard** - Real-time balance display, spending trends, and quick actions
- **Transaction Management** - Add, view, edit, and delete income/expense transactions
- **Budget Tracking** - Set and monitor budgets by category with visual progress indicators
- **Analytics & Reports** - Visual charts and spending analytics with multiple time ranges
- **Goals Management** - Create and track financial goals
- **AI Chat Assistant** - Get personalized financial advice powered by Claude Anthropic
- **Responsive Design** - Mobile-friendly interface with dark mode support
- **Professional UI** - Built with Radix UI components and Tailwind CSS

### 💾 Backend & Database
- **Prisma ORM** - SQLite database with type-safe, automatic schema migrations
- **Database Schema** - Users, Transactions, Budgets, Goals, and ChatMessages tables
- **RESTful API Routes** - Full CRUD operations for all financial data
- **Authentication** - NextAuth.js integration with credential-based login
- **AI Integration** - Anthropic Claude API for intelligent financial analysis

### 🔌 API Endpoints

#### Transactions
- `GET /api/transactions` - List all user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

#### Budgets
- `GET /api/budgets` - List all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget

#### Goals
- `GET /api/goals` - List all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/[id]` - Update goal
- `DELETE /api/goals/[id]` - Delete goal

#### Analytics
- `GET /api/analytics/spending` - Get spending breakdown by category and time

#### AI Chat
- `POST /api/ai/chat` - Send message to AI assistant
- `GET /api/ai/chat` - Get chat history

#### User Management
- `POST /api/users/register` - Register new user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or pnpm
- Anthropic API key (for AI features)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create `.env.local` file:
   ```
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   ANTHROPIC_API_KEY="sk-ant-..."
   ```

3. **Initialize Database**
   ```bash
   npx prisma migrate dev
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── transactions/   # Transaction endpoints
│   │   ├── budgets/        # Budget endpoints
│   │   ├── goals/          # Goal endpoints
│   │   ├── analytics/      # Analytics endpoints
│   │   ├── ai/             # AI chat endpoint
│   │   ├── users/          # User endpoints
│   │   └── auth/           # NextAuth routes
│   ├── page.tsx            # Home page
│   └── layout.tsx          # Root layout
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── pages/              # Page components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
└── styles/
    └── globals.css        # Global styles
```

## 🔐 Authentication

The application uses NextAuth.js with credential-based authentication:

1. Register a new account with email and password
2. Login credentials are securely hashed using bcryptjs
3. Session management with JWT tokens
4. All API endpoints are protected and require authentication

### To Login
- Use any email and password to register
- Subsequent logins use the same credentials

## 🤖 AI Features

The AI Chat Assistant is powered by Anthropic's Claude-3.5-Sonnet model and includes:

- **Spending Analysis** - Analyzes your transaction history
- **Budget Insights** - Reviews your budgets and spending patterns
- **Financial Advice** - Provides personalized recommendations
- **Savings Tips** - Suggests ways to optimize spending

### Setup AI Features

1. Get your API key from [Anthropic Console](https://console.anthropic.com)
2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY="sk-ant-..."
   ```
3. Restart the development server

## 📊 Database Schema

### Users Table
- id (String, Primary Key)
- email (String, Unique)
- password (String)
- name (String)
- avatar (String, Optional)
- createdAt, updatedAt

### Transactions Table
- id, userId (Foreign Key)
- amount, description, category
- type (income/expense)
- date, notes, paymentMode
- createdAt, updatedAt

### Budgets Table
- id, userId (Foreign Key)
- category, budget, spent
- month (DateTime)
- createdAt, updatedAt

### Goals Table
- id, userId (Foreign Key)
- name, description
- targetAmount, currentAmount
- dueDate, category
- createdAt, updatedAt

### ChatMessages Table
- id, userId (Foreign Key)
- role (user/assistant)
- content
- createdAt

## 🛠️ Development

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

### Database Migrations
```bash
npx prisma migrate dev --name <migration_name>
npx prisma studio  # Open Prisma Studio UI
```

## 🔒 Security Considerations

- Passwords are hashed with bcryptjs
- All API endpoints require authentication
- Database queries use Prisma's parameterized queries to prevent SQL injection
- Environment variables store sensitive data
- User data is isolated by user ID

## 🚀 Deployment Instructions

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` (use PostgreSQL for production)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your deployed URL)
   - `ANTHROPIC_API_KEY`

4. Deploy!

### Deploy to Netlify (Supabase)

1. Push code to GitHub
2. Create a new site in Netlify from your GitHub repo
3. Ensure Netlify uses the build command from `netlify.toml`:
   - `npx prisma generate && npm run build`
4. Add environment variables in Netlify dashboard:
   - `DATABASE_URL` (Supabase Postgres URL; preferably pooled URL)
   - `DIRECT_URL` (Supabase direct Postgres URL)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Netlify site URL)
   - `ANTHROPIC_API_KEY`
   - `ANTHROPIC_MODEL`
5. Deploy site

Note: If your existing schema started on SQLite, run `npx prisma db push` once against Supabase to initialize tables quickly.

### For Production Database

Replace SQLite with PostgreSQL:

1. Create PostgreSQL database
2. Update `DATABASE_URL` in `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/finance_tracker"
   DIRECT_URL="postgresql://user:password@localhost:5432/finance_tracker"
   ```
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## 📝 Technologies Used

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Framework**: Tailwind CSS, Radix UI
- **Database**: SQLite (dev) / PostgreSQL (prod), Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: Anthropic Claude API
- **Validation**: Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License

## ❓ FAQ

**Q: How do I reset my password?**
A: Currently, password reset is not implemented. You can create a new account with a different email.

**Q: Can I export my financial data?**
A: This feature is under development. The data is stored in SQLite/PostgreSQL and can be accessed via the Prisma Studio.

**Q: Is my financial data private?**
A: Yes! All data is encrypted in transit (use HTTPS in production) and stored securely. Each user only has access to their own data.

**Q: How much does the AI feature cost?**
A: Costs depend on Claude API usage. Visit [Anthropic Pricing](https://www.anthropic.com/pricing) for details.

## 🎯 Future Enhancements

- [ ] Multi-user households/shared budgets
- [ ] Bank account integration
- [ ] Bill reminders and recurring transactions
- [ ] Multiple currency support
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and PDF exports
- [ ] Investment tracking
- [ ] Tax planning features
- [ ] Backup and sync across devices
- [ ] Google/GitHub OAuth

##support

For issues, questions, or feature requests, please open an issue in the GitHub repository.

---

**Happy Tracking! 💰**
