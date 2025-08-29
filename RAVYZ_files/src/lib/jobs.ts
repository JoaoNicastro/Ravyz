import { api } from "./api";

export const listJobs  = () => api("/jobs");
export const createJob = (input:any) =>
  api("/jobs", { method:"POST", body: JSON.stringify(input) });

// NEW: apply to a job
export const applyToJob = (id: string) =>
  api(`/jobs/${id}/apply`, { method:"POST" });
