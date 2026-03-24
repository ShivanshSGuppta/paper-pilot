# PaperPilot - AI Assessment Creator

Recruiter-grade monorepo for teachers to create assignments, generate structured question papers with AI, and view/export print-ready assessments.

## What It Does

- Create assignments from uploaded `.pdf` or `.txt` references.
- Queue AI generation asynchronously through BullMQ.
- Store assignments and results in MongoDB.
- Publish job progress to the frontend in real time with Socket.IO.
- Render the final output as a school-style exam paper and export it as PDF.

## Tech Stack

- Frontend: Next.js, TypeScript, Zustand, React Query, Socket.IO client
- Backend: Node.js, Express, TypeScript, MongoDB, Redis, BullMQ, Socket.IO
- AI: provider abstraction with strict JSON parsing and schema validation
- PDF: headless browser HTML-to-PDF rendering

## Folder Structure

```text
vedaai-assessment-creator/
  apps/
    api/
    web/
    worker/
  packages/
    shared/
  docs/
  infra/
```

## Local Setup

1. Copy the example env files.

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/worker/.env.example apps/worker/.env
cp apps/web/.env.example apps/web/.env.local
```

2. Install dependencies.

```bash
pnpm install
```

3. Start MongoDB and Redis.

```bash
docker compose up -d mongo redis
```

4. Run the apps.

```bash
pnpm --filter @vedaai/api dev
pnpm --filter @vedaai/worker dev
pnpm --filter @vedaai/web dev
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `WEB_APP_URL` - frontend origin for CORS and Socket.IO
- `SOCKET_CORS_ORIGIN` - websocket origin
- `LLM_PROVIDER` - `gemini`
- `LLM_API_KEY` - Gemini API key (required)
- `LLM_BASE_URL` - Gemini REST base URL
- `LLM_MODEL` - Gemini model name
- `UPLOAD_DIR` - local upload directory for dev
- `SEED_DEMO_DATA` - `true`/`false` (only used in development)

## How the Queue Flow Works

1. The teacher submits the create-assignment form.
2. The API validates the payload, extracts file text, saves the assignment in MongoDB, and enqueues a BullMQ job.
3. The worker consumes the job, builds the structured prompt, checks Redis cache, and calls the LLM if needed.
4. The raw model response is parsed, repaired if required, validated with Zod, normalized, and saved as a `GeneratedResult`.
5. The worker updates MongoDB and publishes websocket events.
6. The frontend receives live updates and refreshes the paper view automatically.

## AI Generation Pipeline

- Convert the assignment form into a normalized prompt bundle.
- Ask the model for strict JSON only.
- Repair malformed JSON with a structured parser when necessary.
- Validate against a raw draft schema.
- Normalize into the final persisted exam-paper shape.
- Never render raw model text in the UI.

## WebSocket Flow

- The frontend subscribes to `assignmentId` and `jobId` rooms.
- The worker publishes lifecycle events to Redis.
- The API relays those events to Socket.IO rooms.
- The job store updates UI state and the result page refreshes automatically.

## Caching

- A deterministic signature is generated from the normalized prompt input.
- Redis stores validated output keyed by that signature.
- Identical inputs reuse the cached payload while still creating correct database records for the new assignment.

## Deployment Notes (Vercel + Render/Railway)

Web (Vercel):
1. Import the `apps/web` project.
2. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` to your API domain.
3. Build command: `pnpm --filter @vedaai/web build`
4. Output: Next.js default (no custom output).

API (Render/Railway):
1. Deploy `apps/api` as a Node service.
2. Set env vars:
   - `NODE_ENV=production`
   - `MONGODB_URI` (MongoDB Atlas)
   - `REDIS_URL` (Upstash/Redis Cloud)
   - `WEB_APP_URL` (Vercel URL)
   - `SOCKET_CORS_ORIGIN` (Vercel URL)
   - `LLM_PROVIDER=gemini`
   - `LLM_API_KEY`
   - `LLM_BASE_URL` (optional)
   - `LLM_MODEL`
   - `UPLOAD_DIR=./uploads`
   - `SEED_DEMO_DATA=false`
3. Start command: `pnpm --filter @vedaai/api start`

Worker (Render/Railway):
1. Deploy `apps/worker` as a background worker.
2. Set env vars:
   - `NODE_ENV=production`
   - `MONGODB_URI`
   - `REDIS_URL`
   - `LLM_PROVIDER=gemini`
   - `LLM_API_KEY`
   - `LLM_BASE_URL` (optional)
   - `LLM_MODEL`
3. Start command: `pnpm --filter @vedaai/worker start`

Health endpoints are exposed at `/health` and `/ready`.

## Screenshots

- Add assignment list screenshots here.
- Add create-assignment screenshots here.
- Add generated paper screenshots here.

## Future Improvements

- User authentication and roles.
- Persistent object storage for uploads.
- Template library for recurring assessment formats.
- More advanced PDF styling and pagination controls.
- Real multi-provider LLM fallback and model routing.
