
# Messenger 2025 🚀

A modern, full-stack real-time messenger app built with Next.js, React, Clerk authentication, Tailwind CSS, and WebSocket (STOMP/SockJS).

---

## Features

- 🔒 Secure authentication with Clerk
- 💬 Real-time chat powered by WebSocket (STOMP/SockJS)
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🧩 Modular React components
- ⚡ Fast and scalable Next.js 15 frontend
- 🗂️ Clean code structure and easy extensibility

---

## Demo

![Messenger Demo](../img/profile.png)

---

## Tech Stack

- **Frontend:** Next.js 15, React 19, Clerk, Tailwind CSS, STOMP/SockJS
- **Backend:** Spring Boot 3.5, MySQL, JPA, Lombok, STOMP/WebSocket *(see backend repo)*

---

## Getting Started

### Prerequisites
- Node.js 20+
- Clerk account (for authentication)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_WS_SERVER=http://localhost:8080/ws
NEXT_PUBLIC_SERVER=http://localhost:8080/
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

## Project Structure

```
app/
	Components/         # Reusable React components
	Providers/          # Context and global providers
	directChat/         # Main chat page
	lib/                # API and utility functions
	signIn/             # Sign-in page
	globals.css         # Global styles
	layout.tsx          # App layout
	page.tsx            # Home page
public/               # Static assets
img/                  # Images
```

---

## Key Components

- **ChatMessage**: Displays a single chat message
- **SideBar**: Shows user list or navigation
- **ChatWindow**: Main chat interface
- **ContextProvidor**: Provides global state (WebSocket, user)

---

## Real-Time Messaging

- Connects to backend WebSocket using STOMP/SockJS
- Subscribes to `/topic/messages` for live updates
- Publishes messages to `/app/chat.send`

---

## Authentication

- Clerk handles sign-up/sign-in and user management
- JWT tokens passed to backend for protected endpoints

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [SockJS](https://github.com/sockjs/sockjs-client)
- [STOMP.js](https://stomp-js.github.io/)

---

## Contact

Created by [Tharindu Silva](https://github.com/TharinduSilva2019774) — feel free to reach out!
