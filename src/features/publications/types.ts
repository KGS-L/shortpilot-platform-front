export type PublicationStatus = "draft" | "scheduled" | "publishing" | "published" | "failed" | "cancelled";

export type PublicationVisibility = "private" | "unlisted" | "public";

export type PublicationFormat = "short_video" | "standard_video" | "photo" | "carousel";

export type Publication = {
  id: string;
  workspace_id: string;
  video_id: string | null;
  format: PublicationFormat;
  asset_ids: string[];
  channel_id: string;
  job_id: string | null;
  external_id: string | null;
  title: string;
  description: string | null;
  visibility: PublicationVisibility;
  status: PublicationStatus;
  scheduled_at: string | null;
  published_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicationBatchCreate = {
  video_id?: string;
  format?: PublicationFormat;
  asset_ids?: string[];
  destinations: Array<{
    channel_id: string;
    title: string;
    description?: string | null;
    visibility?: PublicationVisibility;
    scheduled_at?: string | null;
  }>;
};

export const publicationStatusLabels: Record<PublicationStatus, string> = {
  draft: "Brouillon",
  scheduled: "Programmée",
  publishing: "En cours",
  published: "Publiée",
  failed: "Échec",
  cancelled: "Annulée",
};

export const publicationStatusTones: Record<PublicationStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  scheduled: "bg-blue-50 text-blue-700",
  publishing: "bg-orange-50 text-orange-700",
  published: "bg-lime-50 text-lime-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-500",
};

export const visibilityLabels: Record<PublicationVisibility, string> = {
  private: "Privée",
  unlisted: "Non répertoriée",
  public: "Publique",
};
