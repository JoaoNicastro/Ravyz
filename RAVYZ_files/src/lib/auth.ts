import { api } from "./api";
export async function register(email:string, password:string, role:"CANDIDATE"|"EMPLOYER"){
  return api("/auth/register", { method:"POST", body: JSON.stringify({ email, password, role }) });
}
export async function login(email:string, password:string){
  const data = await api("/auth/login", { method:"POST", body: JSON.stringify({ email, password }) });
  localStorage.setItem("token", data.token);
  return data;
}
