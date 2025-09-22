"use client";
import { useState, useRef} from "react";
import { ScenarioInput } from "./components/InputBoxes";
import { TemplateDropdown, LinkDropdown, ScenarioDropdown} from "./components/TemplateDropdown";
import { NameNode } from "./components/InputBoxes";


export default function HomePage() {
  const [scenarioName, setScenarioName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [nodeName, setNodeName] = useState("");
  const [Nodes, setNodes] = useState([]);
  const [node1, setNode1] = useState("");
  const [node2, setNode2] = useState("");
  const [adapter1, setAdapter1] = useState(0);
  const [adapter2, setAdapter2] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [Links, setLinks] = useState([]);
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  function addNode() {
    if (!templateId || !nodeName) {
      alert("Please select a template and enter a node name.");
      return;
    }
    const newNode = {
      name: nodeName,
      template_id: templateId,
      x: xPos, 
      y: yPos,
    };
    setNodes([...Nodes, newNode]);
    setNodeName(""); 
  }

  function createLink() {
    if (!node1 || !node2) {
      alert("Please select both nodes to create a link.");
      return;
    }
    if (node1 === node2) {
      alert("Cannot link a node to itself.");
      return;
    }

    const linkId = `LINK_${node1.name}_TO_${node2.name}`;

    const newLink = {
      link_id: linkId,
      link_type: "ethernet",
      nodes: [
        {
          node_id: node1.name,
          adapter_number: adapter1,
          port_number: 0,
        },
        {
          node_id: node2.name,
          adapter_number: adapter2,
          port_number: 0,
        },
      ],
    };

    setLinks([...Links, newLink]);
  }

  async function saveScenario() {
    const payload = {
      scenario_name: scenarioName,
      nodes: Nodes,
      links: Links,
    };

    try {
      const res = await fetch("http://localhost:8000/save_scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to save: ${res.status}`);
      }

      const data = await res.json();
      console.log("Response:", data);
      alert(`${data.filename.replace(".json", "")} Scenario Saved`);
    } catch (err) {
      console.error("Error saving scenario:", err);
    }
  }

  async function buildScenario(scenario) {
    try {
      await fetch("http://localhost:8000/build_scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: scenario.filename, name: scenario.name  }),
      });
    }
    catch (err) {
      console.error("Error building scenario:", err);
    }
  }

  async function startScenario(scenario) {
    try {
      await fetch("http://localhost:8000/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: scenario.filename, name: scenario.name  }),
      });
    }
    catch (err) {
      console.error("Error starting scenario:", err);
    }
  }

  return (
    <main className="p-4">
      {/* Scenario Input (left) + Template Dropdown (center) */}
      <div className="grid grid-cols-3 gap-6 mb-6 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-xl font-bold items-start">Scenario Creation</h1>
          <h1 className="text-xl underline">Create Nodes</h1>
          <TemplateDropdown onSelect={setTemplateId} />
          <NameNode onChange={setNodeName} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label className="flex items-center gap-1 text-sm text-gray-300">
              X:
              <input
                className="w-15 border p-1 rounded bg-gray-800 text-white"
                type="number"
                value={xPos}
                onChange={(e) => setXPos(parseInt(e.target.value, 10) || 0)}
              />
            </label>

            <label className="flex items-center gap-1 text-sm text-gray-300">
              Y:
              <input
                className="w-15 border p-1 rounded bg-gray-800 text-white"
                type="number"
                value={yPos}
                onChange={(e) => setYPos(parseInt(e.target.value, 10) || 0)}
              />
            </label>
          </div>
          <button
            onClick={addNode}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Node
          </button>
          {/* Node list */}
          <ul className="mt-4">
            Created Nodes:
            {Nodes.map((node, idx) => (
              <li key={idx}>
                Node Name: {node.name}, Template: {node.template_id}
              </li>
            ))}
          </ul>
          <h1 className="text-xl underline">Create Links</h1>
          <h1 className="text">Link Node 1 and Adapter Number:</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LinkDropdown nodes={Nodes} onSelect={setNode1} />
            <input className="w-10 border p-1 rounded"
              type="number"
              value={adapter1}
              onChange={(e) => setAdapter1(parseInt(e.target.value, 10) || 0)}
            />
          </div>
          <h1 className="text">Link Node 2 and Adapter Number:</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LinkDropdown nodes={Nodes} onSelect={setNode2} />
            <input className="w-10 border p-1 rounded"
              type="number"
              value={adapter2}
              onChange={(e) => setAdapter2(parseInt(e.target.value, 10) || 0)}
            />
          </div>
          <button
            onClick={createLink}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >Create Link</button>
          <ul className="mt-4">
            <h2>Created Links:</h2>
            {Links.map((link, idx) => (
              <li key={idx}>
                {link.nodes[0].node_id} → {link.nodes[1].node_id}
              </li>
            ))}
          </ul>
          <h1 className="text-xl underline">Save Scenario</h1>
          <ScenarioInput onChange={setScenarioName} />
          <button
          onClick={saveScenario}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Save Scenario
          </button>
        </div>

        {/* Center column */}
        <div className="flex flex-col gap-4 items-center justify-center">
          
          <h1 className="text-xl font-bold">Run a Scenario</h1>
          <ScenarioDropdown onSelect={setCurrentScenario}/>
          <button
            onClick={() => buildScenario(currentScenario)}
            className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            disabled={!currentScenario}
          >
            Build Scenario
          </button>
          <button
            onClick={() => startScenario(currentScenario)}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-purple-600"
            disabled={!currentScenario}
          >
            Start Scenario
          </button>
        </div>

        {/* Right column (empty, just balances layout) */}
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-xl font-bold">Right</h1>
        </div>
      </div>

      {/* Node Name input */}
      <div className="flex justify-center mb-6">
        
      </div>

      {/* Add Node button */}
      <div className="flex justify-center">

      </div>


    </main>
  );
}