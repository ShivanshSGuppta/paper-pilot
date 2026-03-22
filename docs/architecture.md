# Architecture

## Overview

VedaAI is organized as a monorepo with three deployable apps:

- `apps/web` - Next.js frontend and dashboard UI
- `apps/api` - Express API, MongoDB persistence, queue orchestration, websocket relay, PDF export
- `apps/worker` - BullMQ consumer that performs AI generation and persistence

Shared contracts and schemas live in `packages/shared` so the frontend, API, and worker agree on the same payload shapes.

## Core Data Flow

1. Teacher creates an assignment in the frontend.
2. The API stores the assignment record in MongoDB and queues a BullMQ job.
3. The worker consumes the job and loads the assignment.
4. A prompt bundle is built from the assignment blueprint, instructions, and uploaded text.
5. The worker checks Redis for a cache hit before calling the LLM provider.
6. The response is parsed and normalized into a structured assessment payload.
7. The worker writes the `GeneratedResult` document and updates assignment state.
8. The API relays websocket events to the frontend.

## Why This Shape

- The API stays thin and responsive.
- Generation is asynchronous and retryable.
- The worker can scale independently.
- Validation is shared and centralized.
- Cached identical prompts avoid repeated model calls.

## Frontend State

- Zustand stores keep the assignment form, job lifecycle, and UI state lightweight.
- React Query handles server state and cache invalidation.
- Socket.IO drives live updates rather than optimistic fake progress.

## Runtime Assumptions

- Single teacher profile for demo purposes.
- Local file storage for uploads during development.
- OpenAI-compatible provider abstraction with strict JSON parsing and schema validation.
