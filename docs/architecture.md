# Frontend Architecture

## Tech Stack
- Next.js 15
- React 19
- Clerk (authentication)
- Tailwind CSS
- STOMP/SockJS (WebSocket)

## Structure
- `/app` — Main Next.js app folder
  - `page.tsx` — Home page
  - `chatWindow/` — Chat UI
  - `Components/` — Reusable React components
  - `Providers/` — Context and global providers
  - `lib/` — API and utility functions

## Data Flow
- User logs in via Clerk
- Messages sent via REST API and WebSocket
- UI updates in real-time using STOMP/SockJS
