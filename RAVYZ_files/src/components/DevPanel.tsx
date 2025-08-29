import { useState } from "react";
import { login, register, logout } from "../lib/auth";
import { createJob, listJobs, applyTo } from "../lib/jobs";
import { updateCandidateMe, updateCompanyMe } from "../lib/profile";

export default function DevPanel() {
  const [email, setEmail] = useState("employer@ravyz.com");
  const [password, setPassword] = useState("123456");
  const [role, setRole] = useState<"EMPLOYER"|"CANDIDATE">("EMPLOYER");
  const [log, setLog] = useState<string>("");

  async function run(fn: () => Promise<any>) {
    try { const r = await fn(); setLog(JSON.stringify(r, null, 2)); }
    catch (e: any) { setLog(e.message || String(e)); }
  }

  return (
    <div style={{padding:16, display:"grid", gap:12}}>
      <h2>Dev Panel</h2>

      <div style={{display:"grid", gap:8}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
        <select value={role} onChange={e=>setRole(e.target.value as any)}>
          <option value="EMPLOYER">EMPLOYER</option>
          <option value="CANDIDATE">CANDIDATE</option>
        </select>
        <div style={{display:"flex", gap:8}}>
          <button onClick={()=>run(()=>register(email, password, role))}>Register</button>
          <button onClick={()=>run(()=>login(email, password))}>Login</button>
          <button onClick={()=>{ logout(); setLog("Logged out"); }}>Logout</button>
        </div>
      </div>

      <hr/>

      <div style={{display:"flex", gap:8}}>
        <button onClick={()=>run(()=>updateCompanyMe({ name:"Ravyz Inc", website:"https://ravyz.example", about:"Contratando!", location:"Boulder, CO" }))}>
          Company: update me
        </button>
        <button onClick={()=>run(()=>createJob({
          title:"Front-end Dev",
          description:"React/Vite/Tailwind",
          location:"Remoto",
          employment:"Full-time",
          requirements:["React","Tailwind"]
        }))}>
          Company: create job
        </button>
      </div>

      <div style={{display:"flex", gap:8}}>
        <button onClick={()=>run(()=>updateCandidateMe({ fullName:"Candidate One", skills:["React","Node","SQL"], location:"Boulder, CO" }))}>
          Candidate: update me
        </button>
        <button onClick={async ()=>{
          const jobs = await listJobs();
          if (jobs.length) { await applyTo(jobs[0].id); setLog(`Applied to ${jobs[0].title}`); }
          else setLog("No jobs to apply");
        }}>
          Candidate: apply first job
        </button>
      </div>

      <div>
        <button onClick={()=>run(()=>listJobs())}>List jobs</button>
      </div>

      <pre style={{whiteSpace:"pre-wrap", background:"#111", color:"#0f0", padding:12, borderRadius:8, minHeight:120}}>
        {log}
      </pre>
    </div>
  );
}
