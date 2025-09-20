"use client";
import { useState, useEffect } from "react";

export async function fetchTemplates() {
  const res = await fetch("http://localhost:8000/templates");
  return res.json();
}

export async function fetchScenarios() {
  const res = await fetch("http://localhost:8000/scenarios");
  return res.json();
}

export  function TemplateDropdown({ onSelect }) {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetchTemplates().then(setTemplates);
  }, []);

  return (
    <div>


      <select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          onSelect(e.target.value);
        }}
        className="block rounded-md border-white-300 shadow-sm bg-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
      >
        <option value="">-- Select Node Template --</option>
        {templates.map((tpl) => (
          <option key={tpl.template_id} value={tpl.template_id}>
            {tpl.name}
          </option>
        ))}
      </select>
    </div>
  );
}


export function LinkDropdown({ nodes, onSelect }) {
  const [selected, setSelected] = useState("");

  return (
    <div>
      <select
        className="block rounded-md border-white-300 shadow-sm bg-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
        value={selected}
        onChange={(e) => {
          const idx = e.target.value;
          setSelected(idx);
          onSelect(nodes[idx]);
        }}
      >
        <option value="">-- Select a Node --</option>
        {nodes.map((node, idx) => (
          <option key={idx} value={idx}>
            {node.name} ({node.template_id})
          </option>
        ))}
      </select>
    </div>
  );
}

export function ScenarioDropdown({ onSelect }) {
  const [selected, setSelected] = useState("");
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    fetchScenarios().then(setScenarios);
  }, []);

  return (
    <div>
      <select
        className="block rounded-md border-white-300 shadow-sm bg-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-white"
        value={selected}
        onChange={(e) => {
          const idx = e.target.value;
          setSelected(idx);
          onSelect(scenarios[idx]);
        }}
      >
        <option value="">-- Select a Scenario --</option>
        {scenarios.map((scenario, idx) => (
          <option key={idx} value={idx}>
            {scenario.name}
          </option>
        ))}
      </select>
    </div>
  );
}
