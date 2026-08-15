export type JobType = "ingest" | "process" | "render" | "publish";

export type JobStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled";

export type Job = {
  id: string;
  workspace_id: string;
  video_id: string | null;
  type: JobType;
  status: JobStatus;
  progress: number;
  attempts: number;
  max_attempts: number;
  payload: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  available_at: string;
  started_at: string | null;
  heartbeat_at: string | null;
  worker_id: string | null;
  finished_at: string | null;
  updated_at: string;
};
