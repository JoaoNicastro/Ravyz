export const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function getToken() { return localStorage.getItem("token") || ""; }

export async function api(path: string, opts: RequestInit = {}) {
  const headers: Record<string,string> = { "Content-Type":"application/json" };
  const token = getToken(); if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...opts, headers: { ...headers, ...(opts.headers||{}) }});
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
