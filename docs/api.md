# API

## Endpoints

### `GET /health`
Returns a basic service heartbeat.

### `GET /ready`
Checks MongoDB and Redis connectivity.

### `POST /api/assignments`
Creates an assignment and enqueues generation.

Multipart fields:

- `title`
- `dueDate`
- `questionBlueprint` JSON string
- `additionalInstructions`
- `teacherName`
- `teacherEmail`
- `schoolName`
- `subject`
- `className`
- `durationMinutes`
- `maximumMarks`
- `file` optional PDF/TXT upload

### `GET /api/assignments`
Lists assignments with optional query filters.

Query params:

- `search`
- `status`

### `GET /api/assignments/:id`
Returns a single assignment.

### `GET /api/assignments/:id/result`
Returns the validated generated paper payload.

### `POST /api/assignments/:id/regenerate`
Re-queues generation for an assignment.

Body:

- `invalidateCache` boolean optional

### `GET /api/jobs/:jobId/status`
Returns queue/job progress.

### `GET /api/assignments/:id/pdf`
Streams the generated paper as PDF.

Query params:

- `mode=teacher|student`
- `answerKey=true|false`

### `DELETE /api/assignments/:id`
Deletes an assignment and related results/job state.

## Response Shape Notes

- Assignment and result documents include both `_id` and `id` for client convenience.
- The frontend only renders normalized structured results, never the raw model text.
