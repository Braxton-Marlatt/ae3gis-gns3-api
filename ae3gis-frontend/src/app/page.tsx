"use client";

import { useState, useEffect } from "react";
import IpInput from "./components/Ipinput";
import Templates from "./components/Templates";
import { Template, ScenarioConfig } from "./types";
import ProjectSelector from "./components/ProjectSelector";
import { generateScenario } from "./components/scenarioGenerator";

export default function HomePage() {
  const [ip, setIp] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<{ project_id: string; name: string } | null>(null);
  const [scenarioData, setScenarioData] = useState<any | null>(null);

  useEffect(() => {
    if (!ip) return; // Don't fetch if IP is empty

    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:8000/scenario/templates?gns3_server_ip=${ip}`
        );

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${await res.text()}`);
        }

        const data: Template[] = await res.json();
        setTemplates(data);

        // Initialize counts to 0 for each template
        const initialCounts: Record<string, number> = {};
        data.forEach((tpl) => {
          initialCounts[tpl.template_id] = 0;
        });
        setCounts(initialCounts);

      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [ip]);


  async function buildScenario(config: ScenarioConfig) {
    try {
      const response = await fetch("http://localhost:8000/scenario/build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data; // matches ScenarioBuildResponse
    } catch (err) {
      console.error("Failed to build scenario:", err);
      throw err;
    }
  }


  const handleDownload = (data: any) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const fileName = selectedProject?.name ?? "scenario";
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen p-8">
      <IpInput ip={ip} setIp={setIp} />
      <ProjectSelector
        gns3ServerIp={ip}
        onSelect={(project) => {
          console.log("Selected project:", project);
          setSelectedProject(project);
        }}
      />
      <h1 className="text-4xl font-bold text-center my-6">Configure IT Domain</h1>
      <Templates
        templates={templates}
        counts={counts}
        setCounts={setCounts}
        loading={loading}
        error={error}
        displayedDevices={
          [
            "tollan-nginx-server",
            "tollan-apache-server",
            "tollan-isc-dhcp-server",
            "tollan-malicious-client",
            "tollan-ftp-server",
            "tollan-benign-client"
          ]
        }
      />
      {/*<h1 className="text-4xl font-bold text-center my-6">Configure OT Domain</h1>
      <Templates
        templates={templates}
        counts={counts}
        setCounts={setCounts}
        loading={loading}
        error={error}
        displayedDevices={
          [
            "tollan-benign-client"
          ]
        }
      />*/}
    {/*{selectedProject && (
    <div className="my-6 p-4 border rounded-lg bg-black-50">
      <h3 className="text-xl font-semibold mb-2">Preview of Data to Be Sent:</h3>
      <pre className="bg-black p-4 rounded text-xs text-left overflow-auto">
        <code>
          {JSON.stringify(
            {
              gns3_server_ip: ip,
              project_name: selectedProject.name,
              project_id: selectedProject.project_id,
              // Filtering counts to only show selected devices
              selected_devices: Object.fromEntries(
                Object.entries(counts).filter(([_, count]) => count > 0)
              ),
              // The full templates array is also sent
              all_available_templates: templates,
            },
            null,
            2
          )}
        </code>
      </pre>
    </div>
  )}*/}
    <button
      onClick={async () => {
        if (selectedProject) {
          const config = await generateScenario(
            ip,
            selectedProject.name,
            selectedProject.project_id,
            templates,
            counts
          );

          setScenarioData(config);
          const result = await buildScenario(config)
        }
      }}
      disabled={!selectedProject}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Generate Scenario
    </button>
    {/* Conditionally render this block only when you have data */}
    {scenarioData && (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Generated Scenario Output:</h2>

        {/* Display Area */}
        <pre className="bg-black-100 p-4 rounded-lg text-sm text-left">
          <code>
            {JSON.stringify(scenarioData, null, 2)}
          </code>
        </pre>

        {/* Download Button */}
        <button
          onClick={() => handleDownload(scenarioData)}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download .json File
        </button>
      </div>
    )}
    </main>
  );
}