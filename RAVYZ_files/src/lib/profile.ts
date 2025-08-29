import { api } from "./api";
export const getCandidateMe   = () => api("/candidates/me");
export const updateCandidateMe = (input:any) => api("/candidates/me", { method:"PUT", body: JSON.stringify(input) });
export const updateCompanyMe   = (input:any) => api("/company/me",   { method:"PUT", body: JSON.stringify(input) });
