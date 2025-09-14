---

## Running with Docker 🐳

You can run Messenger 2025 locally using Docker and Docker Compose for a fully containerized setup.

### Requirements
- **Docker** and **Docker Compose** installed
- Node.js version is set via Dockerfile (`NODE_VERSION=22.13.1`)
- MySQL service runs with default credentials (change for production!)

### Environment Variables
- The app expects environment variables for Clerk and backend URLs. You can use a `.env` or `.env.local` file in the project root, or set them via Docker Compose:
  ```env
  NEXT_PUBLIC_WS_SERVER=http://localhost:8080/ws
  NEXT_PUBLIC_SERVER=http://localhost:8080/
  CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
  ```
- For MySQL, the following are set in `docker-compose.yml`:
  - `MYSQL_ROOT_PASSWORD=example`
  - `MYSQL_DATABASE=messenger`
  - `MYSQL_USER=messenger`
  - `MYSQL_PASSWORD=messengerpass`

### Build & Run

1. **Build and start all services:**
   ```bash
   docker compose up --build
   ```
   This will build the Next.js app and start both the frontend and MySQL database.

2. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - MySQL: localhost:3306

### Ports
- **ts-app (Next.js):** `3000` (exposed as `3000:3000`)
- **mysql-db:** `3306` (exposed as `3306:3306`)

### Notes
- The app runs as a non-root user inside the container for security.
- Persistent MySQL data is stored in the `mysql-data` Docker volume.
- The `ts-app` service depends on `mysql-db` and will wait for it to be healthy before starting.
- If you need to customize environment variables, uncomment the `env_file` line in `docker-compose.yml` and provide your own `.env` file.

---
