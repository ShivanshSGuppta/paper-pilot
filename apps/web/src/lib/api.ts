import {
  AssignmentDocument,
  GeneratedResult,
  JobProgress,
  assignmentCreateInputSchema,
  buildPromptInputSchema
} from "@vedaai/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type AssignmentListResponse = { assignments: Array<AssignmentDocument & { id: string }> };
export type AssignmentResponse = { assignment: AssignmentDocument & { id: string } | null };
export type ResultResponse = { result: GeneratedResult & { id: string } };
export type JobResponse = { job: JobProgress & { id?: string; message?: string } };

export function getApiUrl() {
  return API_URL;
}

export async function listAssignments(search?: string, status?: string) {
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (status) qs.set("status", status);
  return request<AssignmentListResponse>(`/api/assignments?${qs.toString()}`);
}

export async function getAssignment(id: string) {
  return request<AssignmentResponse>(`/api/assignments/${id}`);
}

export async function getAssignmentResult(id: string) {
  return request<ResultResponse>(`/api/assignments/${id}/result`);
}

export async function getJobStatus(jobId: string) {
  return request<{ job: JobProgress }>(`/api/jobs/${jobId}/status`);
}

export async function createAssignment(formData: FormData) {
  const response = await fetch(`${API_URL}/api/assignments`, {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || "Failed to create assignment");
  }
  return response.json() as Promise<{ assignment: AssignmentDocument & { id: string }; job: JobProgress; cached: boolean }>;
}

export async function regenerateAssignment(id: string, invalidateCache = false) {
  return request<{ job: JobProgress }>(`/api/assignments/${id}/regenerate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invalidateCache })
  });
}

export async function deleteAssignment(id: string) {
  return request<void>(`/api/assignments/${id}`, { method: "DELETE" });
}

export function getPdfUrl(id: string, mode = "teacher", answerKey = true) {
  const qs = new URLSearchParams();
  qs.set("mode", mode);
  qs.set("answerKey", String(answerKey));
  return `${API_URL}/api/assignments/${id}/pdf?${qs.toString()}`;
}

export function toAssignmentPayload(values: unknown) {
  return assignmentCreateInputSchema.parse(values);
}

export function toPromptPayload(values: unknown) {
  return buildPromptInputSchema.parse(values);
}
