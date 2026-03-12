# Quick Start Guide

## Initial Setup (One-Time)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env.local` file has been created with default values. For AI features to work:

1. Get Anthropic API key from: https://console.anthropic.com/
2. Update `.env.local`:
   ```
   ANTHROPIC_API_KEY="sk-ant-your-key-here"
   ```

### 3. Database is Already Ready
The SQLite database has been initialized. No additional setup needed!

### 4. Start the Application
```bash
npm run dev
```

Open: http://localhost:3000

## Using the App

### First Steps
1. **Create an Account** - Register with any email and password
2. **Add Transactions** - Go to "Add Transaction" to record income/expenses
3. **View Dashboard** - See your balance and spending overview
4. **Chat with AI** - Click the AI chat widget for financial advice
5. **Set Budgets** - Create budgets in the Budgets section

### Key Features

**Dashboard**
- Real-time balance display
- Recent transactions
- Spending breakdown charts
- Quick access to main features

**Transactions**
- Add, view, edit, delete transactions
- Filter by category, type, date
- Search transactions by description

**Budgets**
- Set monthly budgets by category
- Track spending against budgets
- Visual progress indicators

**Analytics**
- Spending trends over time
- Income vs expense breakdown
- Category analysis

**Goals**
- Create financial goals
- Track progress toward goals
- Set target amounts and dates

**AI Assistant**
- Ask questions about your finances
- Get spending analysis
- Receive personalized recommendations
- Automatic context from your data

## Common Tasks

### Add a Transaction
1. Click "Add Transaction" in sidebar
2. Choose Income or Expense
3. Enter amount
4. Select category
5. Choose payment method
6. Add date and notes
7. Click "Add"

### Set a Budget
1. Go to Budgets
2. Click "Create Budget"
3. Select category
4. Set amount
5. Choose month
6. Save

### Chat with AI
1. Click AI chat widget (bottom right)
2. Type your question
3. Get instant financial insights

## Troubleshooting

**Issue**: Data not appearing
- **Solution**: Refresh the page, check browser console for errors

**Issue**: AI chat not working
- **Solution**: Verify `ANTHROPIC_API_KEY` is set in `.env.local` and restart the dev server

**Issue**: Can't add transactions
- **Solution**: Make sure you're logged in. Check the API response in browser DevTools

**Issue**: Database errors
- **Solution**: Run `npx prisma migrate reset` to reset the database

## Database Management

### View/Edit Data with Prisma Studio
```bash
npx prisma studio
```
This opens a web interface to view and manage all your data.

### Reset Database (Deletes All Data)
```bash
npx prisma migrate reset
```

## Performance Tips

1. **Clear Browser Cache**: If UI doesn't update, clear cache
2. **Check Network**: Open DevTools to see API response times
3. **Optimize Images**: Keep images small for better performance
4. **Use Filters**: Filter before searching for faster results

## Security Notes

- Never share your `ANTHROPIC_API_KEY`
- Keep `NEXTAUTH_SECRET` confidential
- Change `NEXTAUTH_SECRET` before deploying to production
- Use strong passwords

## API Usage Tips

All API endpoints are at `/api/`:
- `/api/transactions` - Manage transactions
- `/api/budgets` - Manage budgets
- `/api/goals` - Manage goals
- `/api/ai/chat` - Chat with AI
- `/api/analytics/spending` - Get analytics

Use any HTTP client to test:
```bash
curl http://localhost:3000/api/transactions
```

## Need Help?

1. Check browser console for errors (F12)
2. Check server logs in terminal
3. Verify environment variables are set
4. Try refreshing the page
5. Restart the dev server: `npm run dev`

---

**You're all set! Start building your financial future! 🚀**
