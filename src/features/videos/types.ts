export type VideoStatus = "uploaded" | "queued" | "processing" | "ready" | "failed";

export type Video = {
  id: string;
  workspace_id: string;
  parent_video_id: string | null;
  kind: "source" | "clip";
  sequence_order: number | null;
  title: string | null;
  source_url: string | null;
  storage_key: string | null;
  rendered_storage_key: string | null;
  mime_type: string | null;
  duration_seconds: number | null;
  narration_text: string | null;
  rendered_at: string | null;
  status: VideoStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type MediaAsset = {
  id: string;
  workspace_id: string;
  type: "image";
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  retention_expires_at: string | null;
  created_at: string;
};

export type IngestJob = {
  id: string;
  workspace_id: string;
  video_id: string | null;
  type: "ingest";
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  progress: number;
  created_at: string;
};

export type UploadProgress = { loaded: number; total: number; percent: number };
