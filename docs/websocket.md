# Real-Time Messaging (WebSocket)

## Overview
Messenger 2025 uses STOMP over SockJS for real-time chat.

## How It Works
- WebSocket connection is established to the backend.
- Messages are sent and received using STOMP protocol.
- UI updates instantly when new messages arrive.

## Key Files
- `app/lib/api.ts` — WebSocket setup and message handling
- `app/Providers/ContextProvidor.tsx` — Provides WebSocket context to components
