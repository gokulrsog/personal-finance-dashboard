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
- **Prisma ORM + Supabase Postgres** - Type-safe database access with a hosted PostgreSQL backend
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
- Node.js 20+
- npm or pnpm
- Supabase project
- Anthropic API key (for AI features)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create `.env.local` file:
   ```
   DATABASE_URL="postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require"
   NEXTAUTH_SECRET="generate-a-random-64-char-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ANTHROPIC_MODEL="claude-sonnet-4-5"
   ANTHROPIC_API_KEY="sk-ant-..."
   ```

3. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
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
- This app connects to Supabase through Prisma, so you do not need `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, or the Supabase service role key for the current architecture

## 🚀 Deployment Instructions

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. In Vercel Project Settings -> Environment Variables, add:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `ANTHROPIC_API_KEY`
   - `ANTHROPIC_MODEL`
4. Set `NEXTAUTH_URL` to your production Vercel domain, for example `https://wealth-track.vercel.app`
5. Deploy

### Supabase Setup

1. Create a Supabase project
2. In Supabase, click `Connect`
3. Copy the `Transaction pooler` connection string:
   - use this as `DATABASE_URL`
   - it usually uses port `6543`
4. Copy the `Direct connection` connection string:
   - use this as `DIRECT_URL`
   - it usually uses port `5432`
5. If your password contains `@`, encode it as `%40`
6. Run this once against the empty Supabase database:
   ```bash
   npx prisma db push
   ```

### Where To Get Each Key

- `DATABASE_URL`:
  Supabase -> Connect -> Transaction pooler
- `DIRECT_URL`:
  Supabase -> Connect -> Direct connection
- `NEXTAUTH_SECRET`:
  Generate it yourself with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `NEXTAUTH_URL`:
  Local: `http://localhost:3000`
  Production: your Vercel domain
- `ANTHROPIC_API_KEY`:
  Anthropic Console -> API Keys
- `ANTHROPIC_MODEL`:
  `claude-sonnet-4-5`

## 📝 Technologies Used

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Framework**: Tailwind CSS, Radix UI
- **Database**: Supabase PostgreSQL, Prisma ORM
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
