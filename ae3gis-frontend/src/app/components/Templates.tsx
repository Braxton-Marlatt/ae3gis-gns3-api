"use client";

import React from "react";
import { Template } from "../types";

interface TemplatesProps {
  templates: Template[];
  counts: Record<string, number>;
  setCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  loading: boolean;
  error: string | null;
  displayedDevices: string[];
}

export default function Templates({
  templates,
  counts,
  setCounts,
  loading,
  error,
  displayedDevices,
}: TemplatesProps) {
  if (loading) return <p>Loading templates...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  // Filter only the devices we want to show
  const filtered = templates.filter((tpl) =>
    displayedDevices.includes(tpl.name)
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filtered.map((tpl) => (
        <div
            key={tpl.template_id}
            className="p-4 border border-gray-700 rounded-lg shadow bg-gray-900 flex flex-col items-center"
            >
            <h3 className="text-lg font-semibold text-gray-100 text-center">
                {tpl.name}
            </h3>
            <p className="text-xs text-gray-400 break-all text-center">
                {tpl.template_id}
            </p>
            <input
                type="number"
                min={0}
                value={counts[tpl.template_id] || 0}
                onChange={(e) =>
                setCounts((prev) => ({
                    ...prev,
                    [tpl.template_id]: parseInt(e.target.value, 10) || 0,
                }))
                }
                className="mt-2 w-16 border border-gray-600 rounded px-2 py-1 text-center bg-gray-800 text-gray-100"
            />
        </div>
      ))}
    </div>
  );
}
