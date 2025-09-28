"use client";
import { useState, useEffect } from "react";

interface Project {
  project_id: string;
  name: string;
}

export default function ProjectSelector({ gns3ServerIp, onSelect }: { gns3ServerIp: string, onSelect: (project: Project) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gns3ServerIp) return;

    setLoading(true);
    fetch(`http://localhost:8000/scenario/projects?gns3_server_ip=${gns3ServerIp}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [gns3ServerIp]);

  return (
    <div className="my-4">
      <label className="block mb-2 font-medium">Select Project</label>
      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <select
          className="border rounded px-3 py-2 w-63 bg-black "
          onChange={(e) => {
            const project = projects.find((p) => p.project_id === e.target.value);
            if (project) onSelect(project);
          }}
        >
          <option value="">-- Choose a project --</option>
          {projects.map((p) => (
            <option key={p.project_id} value={p.project_id}>
              {p.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}