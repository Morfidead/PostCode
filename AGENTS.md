# PostCode — Project Instructions

## Project
PostCode is a financial platform with:
- Landing page and registration
- Savings calculator
- Subscription with simulated payment
- Personal cabinet
- Corporate tariff page
- Admin dashboard
- Financial forecasts for 1,000 / 10,000 / 100,000 users

## Technology Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Recharts
- Zod

## Development Rules

1. Use TypeScript. Avoid `any`.
2. Keep components small and reusable.
3. Separate business logic from UI.
4. Use one shared financial model for the calculator, admin dashboard and forecasts.
5. Store and calculate money in integer kopecks.
6. Clearly distinguish registered users from paying subscribers.
7. Do not invent financial rates, tariffs or business assumptions. Ask for clarification when needed.
8. Payments must be simulated. Do not integrate real payment processing.
9. Never store passwords, API keys or secrets in source code.
10. Add validation and error handling.
11. Keep the application responsive.
12. Do not introduce unnecessary dependencies.

## Git Rules
- Main branch: `main`.
- Do not commit or push without explicit user approval.
- Use feature branches for substantial functionality.
- Keep commits small and descriptive.

## Working with AI
- Inspect existing code before modifying it.
- Explain the purpose of significant changes.
- Do not rewrite unrelated files.
- Run available checks after making changes.
- Ask before making architectural decisions that affect the whole project.