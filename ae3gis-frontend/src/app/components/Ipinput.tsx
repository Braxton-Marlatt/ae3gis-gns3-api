"use client";
import { useState } from "react";

interface IpInputProps {
  ip: string;
  setIp: (ip: string) => void;
}

export default function IpInput({ ip, setIp }: IpInputProps) {
  // local state for the input field
  const [draftIp, setDraftIp] = useState(ip);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="ip" className="font-medium">
        Enter GNS3 Server IP
      </label>
      <div className="flex gap-2">
        <input
          id="ip"
          type="text"
          placeholder="192.168.1.1"
          value={draftIp}
          onChange={(e) => setDraftIp(e.target.value)}
          className="border rounded-lg px-3 py-2 w-64"
        />
        <button
          onClick={() => setIp(draftIp)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch
        </button>
      </div>
    </div>
  );
}
