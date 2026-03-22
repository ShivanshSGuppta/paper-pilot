# Queue Flow

## Lifecycle

1. `POST /api/assignments`
2. API validates and saves the assignment.
3. API enqueues BullMQ job `vedaai:generation`.
4. Worker receives the job and emits `job:started`.
5. Worker checks Redis cache using the normalized prompt signature.
6. On cache hit, the worker clones the cached validated payload into a new result record.
7. On cache miss, the worker calls the LLM provider and parses the response.
8. Worker emits progress updates, saves MongoDB records, and emits `job:completed`.
9. API relays websocket events to the subscribed frontend rooms.

## Retry Strategy

- BullMQ uses exponential backoff.
- Failed jobs update the assignment state to `failed`.
- The frontend can trigger a regenerate request with cache invalidation.

## Cache Policy

- Cache key is derived from the normalized prompt input.
- Cache entries store validated structured payloads only.
- Cached results still create proper assignment-linked result documents.

## Websocket Events

- `job:queued`
- `job:started`
- `job:progress`
- `job:completed`
- `job:failed`
