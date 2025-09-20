"use client";
import { useState } from "react";

export function ScenarioInput({ onChange }) {
  const [name, setName] = useState("");

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Enter scenario name..."
        className="border border-gray-300 rounded-md px-3 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export function NameNode({onChange}) {
    const [nodeNode, setNodeName] = useState("");

    return (
        <div>
            <input
                type="text"
                value={nodeNode}
                onChange={(e) => {
                    setNodeName(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder="Enter node name..."
                className="border border-gray-300 rounded-md px-3 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onFocus={() => setNodeName("")}
            />
        </div>
    )
}
