# OASIS AI Scribe

Aplication for transcribing audio files using AI models.

## Technologies Used

- **Backend**: NestJS, TypeScript, PostgreSQL, Prisma ORM
- **Frontend**: React, Vite, TypeScript
- **AI Models**: OpenAI Whisper, Ollama 3.1
- **Containerization**: Docker, Docker Compose

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/AdalZayas/ai-oasis-scribe
    cd ai-oasis-scribe
   ```

2. You can run either using Docker or setting up a local environment.

---

### Using Docker

Make sure you have Docker installed. Then, build and run the Docker container:

```bash
  docker compose -f docker-compose.dev.yml up -d --build --force-recreate
```

Once the containers are up and running, you need to pull the Ollama model:

```bash
docker exec -it oasis_ollama ollama pull llama3.1
```

then you need seed the database:

```bash
docker exec -it oasis_backend_dev npm run prisma:seed
```

This will set up all necessary services including the database and the application itself.

- The backend will be accessible at `http://localhost:9090/api`.
- The frontend will be accessible at `http://localhost:5174`.

and is ready to use.

---

### Local Environment Setup

run the following steps to set up the backend and frontend locally:

1. **LLM and Database Setup**:

   - You can run the docker container that contains the llm's and the database:

   ```bash
   docker compose -f docker-compose..yml up -d
   ```

   - Once the containers are up and running, you need to pull the Ollama model:

   ```bash
   docker exec -it oasis_ollama ollama pull llama3.1
   ```

2. **Backend Setup**:

   - Navigate to the backend directory:

```bash
cd backend
```

- Install dependencies:

```bash
npm install
```

- Set up environment variables by creating a `.env` file based on `.env.example`.
- Run database migrations and seed the database:

```bash
npx prisma db push
npm run prisma:seed
```

- Start the backend server:

```bash
npm run start:dev
```

The backend will be accessible at `http://localhost:9090/api`.

3. **Frontend Setup**:

   - Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

- Install dependencies:

```bash
npm install
```

- Set up environment variables by creating a `.env` file based on `.env.example`.
- Start the frontend development server:

```bash
npm run dev
```

     The frontend will be accessible at `http://localhost:5174`.

You can set up whatever port you want to use to evit conflicts with other services that you might have running locally.

---
